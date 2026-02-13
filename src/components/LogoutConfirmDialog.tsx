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
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LogoutConfirmDialogProps {
  trigger?: React.ReactNode;
  variant?: 'icon' | 'full';
}

export function LogoutConfirmDialog({ trigger, variant = 'icon' }: LogoutConfirmDialogProps) {
  const { signOut } = useAuth();

  const defaultTrigger = variant === 'icon' ? (
    <Button variant="ghost" size="sm" className="text-muted-foreground">
      <LogOut className="h-4 w-4" />
    </Button>
  ) : (
    <Button 
      variant="outline" 
      className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be signed out of your account. Your progress is saved and you can log back in anytime.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => signOut()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
