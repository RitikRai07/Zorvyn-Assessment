'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { Transaction } from '@/lib/types'
import { getExpensesByCategory } from '@/lib/utils/calculations'
import { formatCurrency } from '@/lib/utils/formatting'
import { TrendingUp } from 'lucide-react'

interface SpendingBreakdownChartProps {
  transactions: Transaction[]
  onCategoryClick?: (category: string) => void
}

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  '#f6a623',
  '#bd10e0',
]

export function SpendingBreakdownChart({
  transactions,
  onCategoryClick,
}: SpendingBreakdownChartProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const expensesByCategory = getExpensesByCategory(transactions)
  const data = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
    }))
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <Card className="animate-fadeIn border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No expense data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const topCategory = data[0]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percent = ((payload[0].value / total) * 100).toFixed(1)
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-2xl backdrop-blur-sm">
          <p className="text-sm font-semibold text-foreground">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {formatCurrency(payload[0].value)}
          </p>
          <div className="mt-1 pt-1 border-t border-border/50">
            <p className="text-xs text-primary font-bold">{percent}% of total</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="animate-fadeIn border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden relative group">
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="pb-2 sm:pb-4 relative z-10">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <span>Category Breakdown</span>
            <TrendingUp className="w-5 h-5 text-primary group-hover:rotate-45 transition-transform duration-300" />
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Spending distribution</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Animated Pie Chart Container */}
        <div className="w-full h-64 sm:h-80 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="gradientFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    opacity={hoveredCategory === entry.name ? 1 : 0.75}
                    style={{
                      filter: hoveredCategory === entry.name ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                      transform: hoveredCategory === entry.name ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category List with Enhanced Animations */}
        <div className="space-y-2 mt-6">
          {data.map((item, index) => {
            const percent = ((item.value / total) * 100).toFixed(0)
            const isTop = index === 0
            
            return (
              <div
                key={item.name}
                className="group/item relative"
                onMouseEnter={() => setHoveredCategory(item.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{
                  animation: `slideInUp 0.5s ease-out forwards`,
                  animationDelay: `${index * 50}ms`,
                  opacity: 0
                }}
              >
                <button
                  onClick={() => onCategoryClick?.(item.name)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 hover:bg-muted/50 cursor-pointer group-hover/item:translate-x-1 group-hover/item:shadow-md"
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0 group-hover/item:scale-150 transition-all duration-300 shadow-sm"
                    style={{ 
                      backgroundColor: COLORS[index % COLORS.length],
                      boxShadow: hoveredCategory === item.name ? `0 0 12px ${COLORS[index % COLORS.length]}` : 'none'
                    }}
                  />
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium text-foreground truncate group-hover/item:text-primary transition-colors">
                          {item.name}
                        </p>
                        {isTop && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary shrink-0 animate-pulse">
                            🔥 Top
                          </span>
                        )}
                      </div>
                      {/* Enhanced animated progress bar */}
                      <div className="w-full bg-muted/50 rounded-full h-2 mt-1.5 overflow-hidden relative border border-border/20">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden group-hover/item:opacity-100 opacity-75"
                          style={{ 
                            width: `${percent}%`,
                            background: `linear-gradient(90deg, ${COLORS[index % COLORS.length]}, ${COLORS[(index + 1) % COLORS.length]})`,
                          }}
                        >
                          {/* Shimmer effect */}
                          <div 
                            className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover/item:opacity-30 animate-shimmer"
                            style={{
                              animation: hoveredCategory === item.name ? 'shimmer 2s infinite' : 'none'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col gap-1 shrink-0">
                    <p className="text-xs font-bold text-muted-foreground group-hover/item:text-primary transition-colors">
                      {percent}%
                    </p>
                    <p className="text-xs font-semibold text-foreground group-hover/item:scale-110 transition-transform origin-right">
                      {formatCurrency(item.value)}
                    </p>
                  </div>
                </button>
              </div>
            )
          })}
        </div>

        {/* Enhanced Summary Section */}
        <div className="mt-6 pt-4 border-t border-border/30 grid grid-cols-2 gap-3">
          <div className="bg-linear-to-br from-primary/10 to-transparent rounded-lg p-3 border border-primary/20 hover:border-primary/40 transition-colors group-hover/summary:shadow-md" style={{ animation: 'fadeInUp 0.6s ease-out forwards' }}>
            <p className="text-xs text-muted-foreground mb-1 font-medium">Total Expenses</p>
            <p className="font-bold text-lg text-foreground">{formatCurrency(total)}</p>
          </div>
          <div className="bg-linear-to-br from-secondary/10 to-transparent rounded-lg p-3 border border-secondary/20 hover:border-secondary/40 transition-colors group-hover/summary:shadow-md" style={{ animation: 'fadeInUp 0.7s ease-out forwards' }}>
            <p className="text-xs text-muted-foreground mb-1 font-medium">Categories</p>
            <p className="font-bold text-lg text-foreground">{data.length}</p>
          </div>
        </div>
      </CardContent>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </Card>
  )
}
