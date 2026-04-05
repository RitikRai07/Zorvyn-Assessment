'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Area,
  AreaChart,
} from 'recharts'
import { Transaction, Account } from '@/lib/types'
import { getBalanceHistory } from '@/lib/utils/mockData'
import { formatCurrency } from '@/lib/utils/formatting'
import { TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react'

interface BalanceTrendChartProps {
  transactions: Transaction[]
  accounts: Account[]
}

export function BalanceTrendChart({ transactions, accounts }: BalanceTrendChartProps) {
  const data = getBalanceHistory(transactions, accounts)
  const [showFullHistory, setShowFullHistory] = useState(false)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  // Calculate chart data
  const displayData = showFullHistory ? data : data.slice(-30)
  const startBalance = displayData[0]?.balance || 0
  const endBalance = displayData[displayData.length - 1]?.balance || 0
  const trend = endBalance >= startBalance ? 'positive' : 'negative'
  const change = Math.abs(endBalance - startBalance)
  const changePercent = startBalance !== 0 ? ((change / startBalance) * 100).toFixed(1) : '0'

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <p className="text-sm text-muted-foreground font-medium">{payload[0].payload.date}</p>
          <p className="text-lg font-bold text-foreground mt-1">
            {formatCurrency(payload[0].value)}
          </p>
          <div className={`text-xs mt-1 flex items-center gap-1 ${trend === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend === 'positive' ? '+' : '-'}{formatCurrency(change)}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="animate-fadeIn border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 overflow-hidden group relative">
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-all ${trend === 'positive' ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                {trend === 'positive' ? (
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <span>Balance Trend</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground font-medium">
              {showFullHistory ? `📊 Full history (${data.length} days)` : '📈 Last 30 days performance'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="bg-muted/30 rounded-lg px-4 py-2.5 border border-border/50">
              <div className="text-right">
                <p className={`text-lg font-black tracking-tight ${trend === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {trend === 'positive' ? '+' : '-'}{formatCurrency(change)}
                </p>
                <p className={`text-xs font-bold mt-0.5 ${trend === 'positive' ? 'text-green-600/70 dark:text-green-400/70' : 'text-red-600/70 dark:text-red-400/70'}`}>
                  {changePercent}% change
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFullHistory(!showFullHistory)}
              className="gap-1.5 h-10 font-semibold hover:bg-primary/10 border-2"
            >
              {showFullHistory ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">30 Days</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Full History</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Summary Stats */}
      <div className="relative z-10 px-6 py-3 bg-muted/20 border-t border-border/30 grid grid-cols-3 gap-3">
        <div className="text-left">
          <p className="text-xs text-muted-foreground font-medium">Start Balance</p>
          <p className="text-sm font-bold text-foreground mt-1">{formatCurrency(startBalance)}</p>
        </div>
        <div className="text-center border-l border-r border-border/30">
          <p className="text-xs text-muted-foreground font-medium">End Balance</p>
          <p className="text-sm font-bold text-foreground mt-1">{formatCurrency(endBalance)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground font-medium">Change</p>
          <p className={`text-sm font-bold mt-1 ${trend === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend === 'positive' ? '+' : ''}{formatCurrency(change)}
          </p>
        </div>
      </div>

      <CardContent className="pb-4 relative z-10">
        <div className="w-full h-80 sm:h-96 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={displayData} 
              margin={{ top: 10, right: 15, left: 0, bottom: 0 }}
              onMouseMove={(e: any) => {
                if (e.activeLabel) {
                  setHoveredDate(e.activeLabel)
                }
              }}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={trend === 'positive' ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={trend === 'positive' ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="4 4" 
                stroke="var(--border)" 
                vertical={false}
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                stroke="var(--muted-foreground)"
                style={{ fontSize: '12px', fontWeight: '500' }}
                tick={{ fill: 'var(--muted-foreground)', opacity: 0.8 }}
                axisLine={false}
                interval={showFullHistory ? Math.floor(data.length / 6) : 4}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                style={{ fontSize: '12px', fontWeight: '500' }}
                tick={{ fill: 'var(--muted-foreground)', opacity: 0.8 }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={trend === 'positive' ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}
                strokeWidth={3}
                fill="url(#colorBalance)"
                dot={false}
                activeDot={{ r: 6, fill: trend === 'positive' ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)', strokeWidth: 2, stroke: 'white' }}
                isAnimationActive={true}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

