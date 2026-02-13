
-- Add image_url column to cities
ALTER TABLE public.cities ADD COLUMN image_url text DEFAULT NULL;

-- Create city-images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('city-images', 'city-images', true);

-- Storage policies for city-images
CREATE POLICY "City images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'city-images');

CREATE POLICY "Admins can upload city images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'city-images' AND is_admin());

CREATE POLICY "Admins can update city images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'city-images' AND is_admin());

CREATE POLICY "Admins can delete city images"
ON storage.objects FOR DELETE
USING (bucket_id = 'city-images' AND is_admin());
