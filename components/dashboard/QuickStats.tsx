'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Transaction } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/formatting'
import { TrendingUp, TrendingDown, AlertCircle, Zap } from 'lucide-react'

interface QuickStatsProps {
  transactions: Transaction[]
}

export function QuickStats({ transactions }: QuickStatsProps) {
  // Calculate current month stats
  const now = new Date()
  const currentMonth = transactions.filter(t => {
    const tDate = new Date(t.date)
    return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear()
  })

  const currentMonthIncome = currentMonth
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const currentMonthExpense = currentMonth
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  // Previous month comparison
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1)
  const prevMonth = transactions.filter(t => {
    const tDate = new Date(t.date)
    return tDate.getMonth() === prevDate.getMonth() && tDate.getFullYear() === prevDate.getFullYear()
  })

  const prevMonthExpense = prevMonth
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenseChange = prevMonthExpense !== 0 
    ? ((currentMonthExpense - prevMonthExpense) / prevMonthExpense) * 100
    : 0

  // Top spending category
  const categoryTotals = currentMonth
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]

  // Daily average
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const dailyAverage = currentMonthExpense / daysInMonth

  const stats = [
    {
      label: 'This Month',
      value: formatCurrency(currentMonthExpense),
      sublabel: 'Total Expenses',
      icon: TrendingDown,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
      change: expenseChange,
      changeLabel: expenseChange > 0 ? '↑ vs last month' : '↓ vs last month',
      changeColor: expenseChange > 0 ? 'text-red-500' : 'text-green-500',
    },
    {
      label: 'Income This Month',
      value: formatCurrency(currentMonthIncome),
      sublabel: 'Total Income',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      change: currentMonthIncome > 0 ? 100 : 0,
      changeLabel: '+Steady income',
      changeColor: 'text-green-500',
    },
    {
      label: 'Top Category',
      value: topCategory?.[0] || 'N/A',
      sublabel: topCategory ? formatCurrency(topCategory[1]) : 'No expenses',
      icon: AlertCircle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      change: 0,
      changeLabel: 'Highest spender',
      changeColor: 'text-orange-500',
    },
    {
      label: 'Daily Average',
      value: formatCurrency(dailyAverage),
      sublabel: `Per day (${daysInMonth} days)`,
      icon: Zap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      change: 0,
      changeLabel: 'Daily burn rate',
      changeColor: 'text-purple-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className={`group border-2 border-border/50 hover:border-primary/40 transition-all duration-300 overflow-hidden ${stat.bgColor}`}>
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground truncate">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.bgColor} border border-current/20`}>
                  <Icon className={`w-5 h-5 ${stat.color} transition-transform group-hover:scale-110`} />
                </div>
              </div>
              
              <div className="pt-3 border-t border-border/20 space-y-1">
                <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
                {stat.change !== 0 && (
                  <p className={`text-xs font-semibold ${stat.changeColor}`}>
                    {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}% {stat.changeLabel}
                  </p>
                )}
                {stat.change === 0 && stat.changeLabel && (
                  <p className={`text-xs font-semibold ${stat.changeColor}`}>
                    📊 {stat.changeLabel}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
