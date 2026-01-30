import { cn } from '@/lib/utils';

const Table = ({ columns, data, onRowAction, actionLabel, actionVariant = 'destructive', loading, emptyMessage = 'No data available' }) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[320px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    <div className="skeleton-pulse h-4 w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2.5">
                      <div className="skeleton-pulse h-4 w-20" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center md:p-8">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <svg
            className="h-6 w-6 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <p className="text-xs text-muted-foreground md:text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-soft">
      <div className="overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[320px]">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {col.label}
                </th>
              ))}
              {onRowAction && <th className="px-3 py-2.5 text-right" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, idx) => (
              <tr key={row.id || idx} className="table-row-hover">
                {columns.map((col) => (
                  <td key={col.key} className="whitespace-nowrap px-3 py-2.5 text-xs text-foreground md:text-sm">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {onRowAction && (
                  <td className="px-3 py-2.5 text-right">
                    <button
                      onClick={() => onRowAction(row)}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
                        actionVariant === 'destructive' && 'text-destructive hover:bg-destructive/10',
                        actionVariant === 'primary' && 'text-primary hover:bg-primary/10'
                      )}
                    >
                      {actionLabel}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
