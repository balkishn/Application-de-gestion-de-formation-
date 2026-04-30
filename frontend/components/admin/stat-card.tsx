import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend: string
  color: string
}

export default function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-border/30 hover:border-green-500/50"
      style={{
        background: `linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(126, 34, 206, 0.04))`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-500/20 text-green-400">
            {trend}
          </span>
        </div>
        <p className="text-muted-foreground text-sm font-medium mb-2">{title}</p>
        <p className="text-4xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}
