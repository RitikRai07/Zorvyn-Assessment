'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Transaction } from '@/lib/types'
import { getMonthlyComparison } from '@/lib/utils/calculations'
import { formatCurrency } from '@/lib/utils/formatting'
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react'

interface MonthlyComparisonProps {
  transactions: Transaction[]
}

export function MonthlyComparison({ transactions }: MonthlyComparisonProps) {
  const monthlyData = getMonthlyComparison(transactions)

  // Calculate summary stats
  const totalIncome = monthlyData.reduce((sum, month) => sum + month.income, 0)
  const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expenses, 0)
  const avgMonthlyIncome = monthlyData.length > 0 ? totalIncome / monthlyData.length : 0
  const avgMonthlyExpenses = monthlyData.length > 0 ? totalExpenses / monthlyData.length : 0

  if (monthlyData.length === 0) {
    return (
      <Card className="col-span-1 md:col-span-2 animate-fadeIn">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Monthly Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
            <Calendar className="w-8 h-8 opacity-50" />
            <p>No monthly data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const netPositive = data.net >= 0
      
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-xl w-64">
          <p className="text-sm font-semibold text-foreground mb-2">{data.month}</p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" /> Income
              </span>
              <span className="text-sm font-semibold text-green-600">
                {formatCurrency(data.income)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-red-500" /> Expenses
              </span>
              <span className="text-sm font-semibold text-red-600">
                {formatCurrency(data.expenses)}
              </span>
            </div>
            <div className={`flex justify-between items-center pt-1.5 border-t border-border ${netPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span className="text-xs font-medium">Net</span>
              <span className="text-sm font-bold">{formatCurrency(data.net)}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="col-span-1 md:col-span-2 animate-fadeIn group relative border-border/50 overflow-hidden">
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="relative z-10 pb-3">
        <div className="space-y-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            Monthly Comparison
          </CardTitle>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-muted/30 rounded-lg p-3 border border-border/30 hover:border-green-500/30 transition-colors">
              <p className="text-xs text-muted-foreground mb-1">Avg Income</p>
              <p className="text-sm sm:text-base font-bold text-green-600">
                {formatCurrency(avgMonthlyIncome)}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-border/30 hover:border-red-500/30 transition-colors">
              <p className="text-xs text-muted-foreground mb-1">Avg Expenses</p>
              <p className="text-sm sm:text-base font-bold text-red-600">
                {formatCurrency(avgMonthlyExpenses)}
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-border/30 hover:border-purple-500/30 transition-colors col-span-2 sm:col-span-1">
              <p className="text-xs text-muted-foreground mb-1">Total Income</p>
              <p className="text-sm sm:text-base font-bold text-foreground">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className={`bg-muted/30 rounded-lg p-3 border transition-colors col-span-2 sm:col-span-1 ${
              totalIncome - totalExpenses >= 0 
                ? 'border-green-500/30 hover:border-green-500/50' 
                : 'border-red-500/30 hover:border-red-500/50'
            }`}>
              <p className="text-xs text-muted-foreground mb-1">Net Balance</p>
              <p className={`text-sm sm:text-base font-bold ${
                totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(totalIncome - totalExpenses)}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={monthlyData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
            <XAxis
              dataKey="month"
              stroke="var(--muted-foreground)"
              style={{ fontSize: '12px' }}
              tick={{ fill: 'var(--muted-foreground)' }}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              style={{ fontSize: '12px' }}
              tick={{ fill: 'var(--muted-foreground)' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
            <Legend 
              wrapperStyle={{ color: 'var(--foreground)', paddingTop: '10px' }}
              iconType="square"
            />
            <Bar
              dataKey="income"
              fill="url(#colorIncome)"
              name="Income"
              isAnimationActive={true}
              animationDuration={800}
              radius={[8, 8, 0, 0]}
              className="hover:opacity-75 transition-opacity"
            />
            <Bar
              dataKey="expenses"
              fill="url(#colorExpenses)"
              name="Expenses"
              isAnimationActive={true}
              animationDuration={800}
              radius={[8, 8, 0, 0]}
              className="hover:opacity-75 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
