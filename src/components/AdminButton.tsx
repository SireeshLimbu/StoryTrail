import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsAdmin } from '@/hooks/useAdmin';

export function AdminButton() {
  const { data: isAdmin, isLoading } = useIsAdmin();

  // Don't show anything while loading or if not admin
  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <Link to="/admin" className="fixed bottom-20 right-4 z-50">
      <Button 
        size="sm" 
        variant="secondary"
        className="shadow-lg gap-2 bg-primary/90 text-primary-foreground hover:bg-primary"
      >
        <Settings className="h-4 w-4" />
        Admin
      </Button>
    </Link>
  );
}
