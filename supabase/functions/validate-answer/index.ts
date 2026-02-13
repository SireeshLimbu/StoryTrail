import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's auth
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify the user
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;

    // Parse request body
    const { locationId, answerIndex, cityId, freeTextAnswer } = await req.json();

    if (!locationId || !cityId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: locationId, cityId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role to access the base locations table
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check if playtest mode is enabled
    const { data: playtestSetting } = await supabaseAdmin
      .from('app_settings')
      .select('value')
      .eq('key', 'playtest_enabled')
      .maybeSingle();
    
    const playtestEnabled = playtestSetting?.value?.enabled === true;

    // Check if city is free (price_cents = 0)
    const { data: city, error: cityError } = await supabaseAdmin
      .from('cities')
      .select('price_cents, is_published')
      .eq('id', cityId)
      .single();

    if (cityError || !city) {
      return new Response(
        JSON.stringify({ error: 'City not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!city.is_published) {
      return new Response(
        JSON.stringify({ error: 'City not available' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If city is not free, check purchase (unless playtest mode is enabled)
    if (city.price_cents > 0 && !playtestEnabled) {
      const { data: purchase } = await supabaseAdmin
        .from('user_purchases')
        .select('id')
        .eq('user_id', userId)
        .eq('city_id', cityId)
        .maybeSingle();

      if (!purchase) {
        return new Response(
          JSON.stringify({ error: 'Purchase required' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Get the location with the correct answer (using admin client)
    const { data: location, error: locationError } = await supabaseAdmin
      .from('locations')
      .select('id, correct_answer_index, correct_answer_indices, clue_text, is_intro_location, city_id, answer_type, free_text_answer')
      .eq('id', locationId)
      .single();

    if (locationError || !location) {
      return new Response(
        JSON.stringify({ error: 'Location not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify location belongs to the claimed city
    if (location.city_id !== cityId) {
      return new Response(
        JSON.stringify({ error: 'Location does not belong to this city' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine if answer is correct based on answer_type
    let isCorrect = false;
    
    if (location.is_intro_location) {
      isCorrect = true;
    } else if (location.answer_type === 'free_text') {
      // Case-insensitive comparison for free text answers
      if (freeTextAnswer && location.free_text_answer) {
        isCorrect = freeTextAnswer.trim().toLowerCase() === location.free_text_answer.trim().toLowerCase();
      }
    } else {
      // Multiple choice - check against correct_answer_indices first, fallback to correct_answer_index
      if (location.correct_answer_indices && location.correct_answer_indices.length > 0) {
        isCorrect = location.correct_answer_indices.includes(answerIndex);
      } else {
        isCorrect = answerIndex === location.correct_answer_index;
      }
    }

    if (isCorrect) {
      // Record progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          city_id: cityId,
          location_id: locationId,
        });

      // Ignore duplicate errors
      if (progressError && !progressError.message.includes('duplicate')) {
        console.error('Progress insert error:', progressError);
      }

      return new Response(
        JSON.stringify({ 
          correct: true, 
          clue_text: location.clue_text 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ correct: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
