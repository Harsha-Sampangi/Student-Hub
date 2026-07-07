export function SkeletonKPI() {
  return (
    <div className="bg-admin-surface rounded-admin-lg border border-admin-border p-6 shadow-admin animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 bg-admin-border rounded"></div>
        <div className="h-10 w-10 bg-admin-border rounded-lg"></div>
      </div>
      <div className="h-8 w-16 bg-admin-border rounded mb-4"></div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-12 bg-admin-border rounded"></div>
        <div className="h-4 w-20 bg-admin-surface-container rounded"></div>
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="w-full">
      <div className="h-12 border-b border-admin-border bg-admin-surface-container/50 flex items-center px-6 gap-4">
        <div className="h-4 w-1/4 bg-admin-border rounded"></div>
        <div className="h-4 w-1/4 bg-admin-border rounded"></div>
        <div className="h-4 w-1/4 bg-admin-border rounded"></div>
        <div className="h-4 w-1/4 bg-admin-border rounded"></div>
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 border-b border-admin-border flex items-center px-6 gap-4 animate-pulse">
          <div className="h-4 w-1/4 bg-admin-surface-container rounded"></div>
          <div className="h-4 w-1/4 bg-admin-surface-container rounded"></div>
          <div className="h-4 w-1/4 bg-admin-surface-container rounded"></div>
          <div className="h-4 w-1/4 bg-admin-surface-container rounded"></div>
        </div>
      ))}
    </div>
  );
}
