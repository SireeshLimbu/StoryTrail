import { AdminLayout } from './AdminLayout';
import { VintageCard, VintageCardContent, VintageCardHeader, VintageCardTitle } from '@/components/VintageCard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { usePlaytestSetting, useUpdatePlaytestSetting } from '@/hooks/usePlaytestSetting';
import { Loader2, AlertTriangle, Gamepad2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const { data: playtestEnabled, isLoading } = usePlaytestSetting();
  const updatePlaytest = useUpdatePlaytestSetting();

  const handlePlaytestToggle = async (enabled: boolean) => {
    try {
      await updatePlaytest.mutateAsync(enabled);
      toast.success(enabled ? 'Playtest mode enabled' : 'Playtest mode disabled');
    } catch (error) {
      console.error('Failed to update playtest setting:', error);
      toast.error('Failed to update setting');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure application-wide settings</p>
        </div>

        <VintageCard>
          <VintageCardHeader>
            <VintageCardTitle className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5" />
              Playtest Mode
            </VintageCardTitle>
          </VintageCardHeader>
          <VintageCardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="playtest-toggle" className="text-base font-medium">
                      Enable Playtest Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      When enabled, users can bypass payment and GPS requirements for testing
                    </p>
                  </div>
                  <Switch
                    id="playtest-toggle"
                    checked={playtestEnabled ?? false}
                    onCheckedChange={handlePlaytestToggle}
                    disabled={updatePlaytest.isPending}
                  />
                </div>

                {playtestEnabled && (
                  <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-destructive">Warning: Playtest mode is active</p>
                      <p className="text-muted-foreground">
                        Users can access paid content without payment. Disable this before going live in production.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </VintageCardContent>
        </VintageCard>
      </div>
    </AdminLayout>
  );
}
