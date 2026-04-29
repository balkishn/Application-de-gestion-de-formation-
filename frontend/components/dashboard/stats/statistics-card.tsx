import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatisticsCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  trend: 'up' | 'down'
}

export function StatisticsCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: StatisticsCardProps) {
  const isPositive = trend === 'up'

  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
      style={{
        background: `linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))`,
        border: '1px solid rgba(16, 185, 129, 0.2)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-4xl font-bold text-foreground mt-3">{value}</p>
          <div className={`flex items-center gap-2 mt-3 text-sm font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{change}</span>
            <span className="text-muted-foreground">{isPositive ? 'from last month' : ''}</span>
          </div>
        </div>
        <div className="flex-shrink-0 p-4 bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/30 rounded-xl shadow-lg">
          <Icon className="w-6 h-6 text-emerald-400" />
        </div>
      </div>
    </div>
  )
}
