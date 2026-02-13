import { cn } from '@/lib/utils';

interface VintageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'parchment' | 'elegant';
}

export function VintageCard({ children, className, variant = 'default', ...props }: VintageCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        variant === 'parchment' && 'vintage-border bg-gradient-to-b from-card to-secondary/30',
        variant === 'elegant' && 'border-accent/30 shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface VintageCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function VintageCardHeader({ children, className }: VintageCardHeaderProps) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  );
}

interface VintageCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function VintageCardTitle({ children, className }: VintageCardTitleProps) {
  return (
    <h3 className={cn('font-display text-2xl font-bold leading-none tracking-tight', className)}>
      {children}
    </h3>
  );
}

interface VintageCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function VintageCardContent({ children, className }: VintageCardContentProps) {
  return (
    <div className={cn('p-6 pt-0 font-body', className)}>
      {children}
    </div>
  );
}

interface OrnamentalDividerProps {
  className?: string;
}

export function OrnamentalDivider({ className }: OrnamentalDividerProps) {
  return (
    <div className={cn('flex items-center justify-center py-4', className)}>
      <span className="text-muted-foreground text-lg">❧ ❧ ❧</span>
    </div>
  );
}
