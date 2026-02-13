import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function DeleteAccountDialog() {
  const { user, session, signOut } = useAuth();
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const canDelete = confirmText === 'DELETE';

  const handleDeleteAccount = async () => {
    if (!canDelete || !user || !session) return;

    setIsDeleting(true);
    try {
      // Call the edge function that handles complete account deletion
      // including the auth.users record for full GDPR compliance
      const response = await supabase.functions.invoke('delete-account', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to delete account');
      }

      toast.success('Your account has been completely deleted.');
      
      // Sign out the user (the session is already invalidated server-side)
      await signOut();
      setOpen(false);
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please contact support.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            <AlertDialogTitle>Delete Your Account?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3">
            <p>This action is <strong>permanent and cannot be undone</strong>.</p>
            <p>The following data will be permanently deleted:</p>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>Your profile information</li>
              <li>All game progress</li>
              <li>Purchase history</li>
              <li>Any saved preferences</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Label htmlFor="confirm-delete" className="text-sm font-medium">
            Type <span className="font-mono bg-muted px-1 rounded">DELETE</span> to confirm
          </Label>
          <Input
            id="confirm-delete"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="mt-2"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText('')}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={!canDelete || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
