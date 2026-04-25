export const SkeletonCard = () => (
  <div className="bg-surface border border-border-base rounded-2xl p-5 animate-pulse">
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-9 h-9 rounded-full bg-surface-hover" />
      <div className="space-y-1.5">
        <div className="w-16 h-3 bg-surface-hover rounded" />
        <div className="w-10 h-2.5 bg-surface-hover rounded" />
      </div>
    </div>
    <div className="w-28 h-7 bg-surface-hover rounded mb-1" />
    <div className="w-20 h-2.5 bg-surface-hover rounded" />
  </div>
);
