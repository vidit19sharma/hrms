import { cn } from '@/lib/utils';

const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-secondary text-secondary-foreground',
    success: 'status-present',
    destructive: 'status-absent',
    outline: 'border border-border bg-transparent text-foreground',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
