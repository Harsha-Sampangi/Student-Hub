export default function SkeletonCard() {
  const shimmerClass = "bg-gradient-to-r from-surface-container via-border to-surface-container dark:from-surface-elevated dark:via-border dark:to-surface-elevated bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col h-[220px]">
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className={`w-24 h-6 rounded-full ${shimmerClass}`} />
        <div className={`w-16 h-5 rounded-full ${shimmerClass}`} />
      </div>
      <div className={`w-3/4 h-6 rounded-md mb-3 ${shimmerClass}`} />
      <div className={`w-1/2 h-4 rounded-md mb-5 ${shimmerClass}`} />
      <div className={`mt-auto w-24 h-4 rounded-md ${shimmerClass}`} />
    </div>
  );
}
