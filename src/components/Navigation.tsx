import { Link, useLocation } from 'react-router-dom';
import { Map, Route, Users, Home, User, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { PLAYTEST_ENABLED } from '@/lib/playtest';
import { LogoutConfirmDialog } from '@/components/LogoutConfirmDialog';

export function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/trail', icon: Route, label: 'Your Trail' },
    { path: '/map', icon: Map, label: 'Map' },
    { path: '/characters', icon: Users, label: 'Characters' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (!user) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors',
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      
      {PLAYTEST_ENABLED && (
        <div className="absolute -top-8 left-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-t-md font-semibold">
          Playtest Mode
        </div>
      )}
    </nav>
  );
}

export function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/home" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold">Story<span className="text-primary">Trail</span></span>
        </Link>
        
        {user && (
          <div className="flex items-center gap-2">
            <LogoutConfirmDialog variant="icon" />
          </div>
        )}
      </div>
    </header>
  );
}
