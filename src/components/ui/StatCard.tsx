import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type ColorKey = 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'teal';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: number;
  trendLabel?: string;
  color?: ColorKey;
  onClick?: () => void;
}

const colorMap: Record<ColorKey, { icon: string; ring: string }> = {
  blue:   { icon: 'bg-blue-50 text-blue-600',   ring: 'ring-blue-100' },
  green:  { icon: 'bg-green-50 text-green-600', ring: 'ring-green-100' },
  amber:  { icon: 'bg-amber-50 text-amber-600', ring: 'ring-amber-100' },
  red:    { icon: 'bg-red-50 text-red-600',     ring: 'ring-red-100' },
  purple: { icon: 'bg-purple-50 text-purple-600', ring: 'ring-purple-100' },
  teal:   { icon: 'bg-teal-50 text-teal-600',   ring: 'ring-teal-100' },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = 'blue',
  onClick,
}: StatCardProps) {
  const colors = colorMap[color] || colorMap.blue;

  const TrendIcon = trend !== undefined
    ? (trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus)
    : Minus;

  const trendColor = trend === undefined || trend === 0
    ? 'text-slate-500 bg-slate-50 ring-slate-600/10'
    : trend > 0
      ? 'text-green-700 bg-green-50 ring-green-600/10'
      : 'text-red-700 bg-red-50 ring-red-600/10';

  return (
    <div
      onClick={onClick}
      className={`card p-5 relative overflow-hidden transition-all duration-[200ms] ${
        onClick
          ? 'cursor-pointer hover:border-slate-300 hover:shadow-md active:scale-[0.995]'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-1">
          <span className="text-2xs font-semibold text-slate-400 uppercase tracking-widest block">{title}</span>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums block">{value}</h3>

          {trendLabel && (
            <div className="pt-1.5 flex items-center">
              <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-3xs font-semibold ring-1 ring-inset ${trendColor}`}>
                <TrendIcon className="w-2.5 h-2.5" />
                {trendLabel}
              </span>
            </div>
          )}
        </div>

        {Icon && (
          <span className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ring-1 ring-inset ${colors.icon} ${colors.ring}`}>
            <Icon className="w-5 h-5" />
          </span>
        )}
      </div>
    </div>
  );
}
