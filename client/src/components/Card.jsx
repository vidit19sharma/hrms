import { cn } from '@/lib/utils';

const Card = ({ children, className, title, description, ...props }) => {
  return (
    <div
      className={cn(
        'min-w-0 rounded-xl border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-medium md:p-5 lg:p-6',
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="mb-3 md:mb-4">
          {title && <h3 className="text-base font-semibold text-foreground md:text-lg">{title}</h3>}
          {description && <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
