import { useState, useCallback } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2, Mic, MicOff, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Location } from '@/lib/types';
import { LocationTTSReader } from './LocationTTSReader';

const ELEVENLABS_AGENT_ID = 'agent_3101kgpwfdz4e9r9jwdr0e16vvd0';

interface LocationVoiceAgentProps {
  location: Location;
  isCompleted: boolean;
  onStarted?: () => void;
}

export function LocationVoiceAgent({ location, isCompleted, onStarted }: LocationVoiceAgentProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to voice agent');
      setError(null);
      
      const locationContext = buildLocationContext(location, isCompleted);
      conversation.sendContextualUpdate(locationContext);
      onStarted?.();
    },
    onDisconnect: () => {
      console.log('Disconnected from voice agent');
    },
    onMessage: (message) => {
      console.log('Voice agent message:', message);
    },
    onError: (error) => {
      console.error('Voice agent error:', error);
      setError('Voice connection failed. Please try again.');
      setIsConnecting(false);
    },
  });

  const buildLocationContext = (loc: Location, completed: boolean) => {
    let context = `You are now at location ${loc.sequence_order}: ${loc.name}.\n\n`;
    
    if (loc.intro_text) {
      context += `Here is the introduction for this location:\n${loc.intro_text}\n\n`;
    }
    
    if (loc.riddle_text && !completed && !loc.is_intro_location) {
      context += `Here is the riddle for the player to solve:\n${loc.riddle_text}\n\n`;
      
      if (loc.answer_options && Array.isArray(loc.answer_options)) {
        context += `The answer options are:\n`;
        loc.answer_options.forEach((option, index) => {
          context += `${index + 1}. ${option}\n`;
        });
      }
    }
    
    if (completed) {
      context += `The player has already completed this location.\n`;
    }
    
    context += `\nPlease read this description to the player in an engaging, storytelling manner. Start by describing the location and setting the scene.`;
    
    return context;
  };

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const { data, error: fnError } = await supabase.functions.invoke(
        'elevenlabs-conversation-token',
        { body: { agentId: ELEVENLABS_AGENT_ID } }
      );

      if (fnError || !data?.signed_url) {
        throw new Error(fnError?.message || 'Failed to get conversation token');
      }

      await conversation.startSession({
        signedUrl: data.signed_url,
      });
    } catch (err) {
      console.error('Failed to start conversation:', err);
      setError(err instanceof Error ? err.message : 'Failed to start voice agent');
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, location, isCompleted]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === 'connected';
  const isSpeaking = conversation.isSpeaking;

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-muted/50 rounded-lg border">
      {/* Status indicator when connected */}
      {isConnected && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isSpeaking ? (
            <>
              <Volume2 className="h-4 w-4 text-accent animate-pulse" />
              <span>AI Tour Guide is speaking...</span>
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 text-primary" />
              <span>Listening... Ask a question!</span>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      {/* Two buttons side by side */}
      <div className="flex gap-3 w-full max-w-md">
        {/* TTS Reader Button */}
        <LocationTTSReader location={location} isCompleted={isCompleted} />

        {/* AI Tour Guide Button */}
        {!isConnected ? (
          <Button 
            onClick={startConversation} 
            disabled={isConnecting}
            variant="secondary"
            className="gap-2 flex-1"
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4" />
                AI Tour Guide
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={stopConversation}
            variant="outline"
            className="gap-2 flex-1"
          >
            <MicOff className="h-4 w-4" />
            End Conversation
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        {isConnected 
          ? 'You can ask questions about this location or the mystery'
          : 'Read aloud for narration, or AI Tour Guide to chat and ask questions'}
      </p>
    </div>
  );
}
