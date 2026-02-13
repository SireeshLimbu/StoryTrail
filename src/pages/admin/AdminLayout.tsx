import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Users, Building2, ArrowLeft, Settings, Map, UserCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsAdmin } from '@/hooks/useAdmin';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/admin', icon: Building2, label: 'Cities', exact: true },
  { path: '/admin/locations', icon: MapPin, label: 'Locations' },
  { path: '/admin/characters', icon: Users, label: 'Characters' },
  { path: '/admin/maps', icon: Map, label: 'Maps' },
  { path: '/admin/users', icon: UserCog, label: 'Users' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { data: isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to StoryTrails
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <span className="font-display text-lg font-bold text-primary">Admin Panel</span>
          </div>
          <Settings className="h-5 w-5 text-muted-foreground" />
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container flex items-center gap-1 py-2">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'gap-2',
                    isActive && 'bg-primary/10 text-primary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}
