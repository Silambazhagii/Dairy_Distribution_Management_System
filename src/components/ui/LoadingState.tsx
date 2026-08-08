

interface LoadingStateProps {
  rows?: number;
  cols?: number;
}

export default function LoadingState({ rows = 5, cols = 4 }: LoadingStateProps) {
  return (
    <div className="space-y-4 py-2 w-full animate-pulse">
      {/* Table Header skeleton */}
      <div className="flex gap-4 border-b border-slate-100 pb-3">
        {Array.from({ length: cols }).map((_, j) => (
          <div
            key={j}
            className="h-3 bg-slate-200 rounded-sm flex-1"
            style={{ width: `${60 + (j % 3) * 15}%` }}
          />
        ))}
      </div>

      {/* Table Row skeletons */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center py-1">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-3.5 bg-slate-100 rounded-sm flex-1"
              style={{ width: `${80 - (j % 2) * 20}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// PageLoader – full page loader with smooth spinning animation
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[320px] w-full">
      <div className="flex flex-col items-center gap-3">
        <span className="relative flex h-8 w-8">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-8 w-8 bg-blue-600" />
        </span>
        <span className="text-2xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Loading System</span>
      </div>
    </div>
  );
}
