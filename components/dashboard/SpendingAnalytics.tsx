'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/formatting'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { AlertCircle, Target, TrendingUp } from 'lucide-react'

interface SpendingAnalyticsProps {
  transactions: Transaction[]
}

export function SpendingAnalytics({ transactions }: SpendingAnalyticsProps) {
  // Get current month transactions
  const now = new Date()
  const currentMonth = transactions.filter(t => {
    const tDate = new Date(t.date)
    return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear()
  })

  // Category breakdown by week
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  const weeklyData = weeks.map((week, weekIndex) => {
    const weekStart = weekIndex * 7
    const weekEnd = weekStart + 7
    
    const weekExpenses = currentMonth
      .filter(t => {
        const day = t.date.getDate()
        return day > weekStart && day <= weekEnd && t.type === 'expense'
      })
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      week,
      amount: weekExpenses,
    }
  })

  // Top expenses
  const topExpenses = currentMonth
    .filter(t => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  // Spending alerts
  const avgDailySpend = weeklyData.reduce((sum, w) => sum + w.amount, 0) / 28
  const weeklyAvg = weeklyData.reduce((sum, w) => sum + w.amount, 0) / 4
  
  const alerts = [
    {
      type: 'warning',
      icon: AlertCircle,
      title: 'High Spending Alert',
      message: `Your average weekly spend is ${formatCurrency(weeklyAvg)}`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    },
    {
      type: 'info',
      icon: Target,
      title: 'Budget Suggestion',
      message: `Daily limit recommended: ${formatCurrency(avgDailySpend)}`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      type: 'success',
      icon: TrendingUp,
      title: 'Smart Insight',
      message: `Biggest category: ${
        Object.entries(
          currentMonth.filter(t => t.type === 'expense').reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount
            return acc
          }, {} as Record<string, number>)
        ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
      }`,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
    },
  ]

  const colors = ['#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#10b981']

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Weekly Breakdown Chart */}
      <Card className="border-2 border-border/50 hover:border-primary/40 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-bold">📊 Weekly Spending Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value) => formatCurrency(value as number)}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="#3b82f6">
                {weeklyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Smart Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alerts.map((alert, index) => {
          const Icon = alert.icon
          return (
            <Card key={index} className={`border-2 border-border/50 ${alert.bgColor} transition-all duration-300 hover:shadow-lg`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${alert.color} shrink-0 mt-0.5`} />
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-sm text-foreground">
                      {alert.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Top Expenses */}
      {topExpenses.length > 0 && (
        <Card className="border-2 border-border/50 hover:border-primary/40 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-bold">💰 Top 5 Expenses This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topExpenses.map((expense, index) => (
                <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="shrink-0">
                      <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-foreground">{expense.description}</p>
                      <p className="text-xs text-muted-foreground">{expense.category}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-red-500">
                      {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
