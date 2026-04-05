'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '@/lib/types'
import { getTopExpenseCategory, getTotalExpenses } from '@/lib/utils/calculations'
import { formatCurrency, formatPercent } from '@/lib/utils/formatting'
import { Target, TrendingUp, Zap } from 'lucide-react'

interface HighestSpendingCategoryProps {
  transactions: Transaction[]
}

export function HighestSpendingCategory({ transactions }: HighestSpendingCategoryProps) {
  const topCategory = getTopExpenseCategory(transactions)
  const totalExpenses = getTotalExpenses(transactions)
  const [isAnimating, setIsAnimating] = useState(true)

  if (!topCategory) {
    return (
      <Card className="animate-fadeIn">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Top Spending Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>No expense data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const percentage = totalExpenses > 0 ? (topCategory.amount / totalExpenses) * 100 : 0

  return (
    <Card className="animate-fadeIn transition-all duration-300 hover:shadow-lg hover:border-primary/40 border-border/50 relative overflow-hidden group">
      {/* Gradient Background Animation */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Target className="w-5 h-5 text-primary" />
            </div>
            Top Category
          </CardTitle>
          <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        {/* Category Display */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
              {topCategory.category}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">Your highest spending category</p>
        </div>

        {/* Stats */}
        <div className="space-y-3 pt-2">
          {/* Amount */}
          <div className="bg-muted/50 rounded-lg p-3 group-hover:bg-muted/70 transition-colors">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Total Amount</p>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(topCategory.amount)}
              </p>
              <p className="text-xs text-primary font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {Math.round(topCategory.amount / transactions.filter(t => t.type === 'expense').length)}
                avg/tx
              </p>
            </div>
          </div>

          {/* Percentage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-medium">Percentage of total</span>
              <span className="text-lg font-bold text-primary">
                {percentage.toFixed(1)}%
              </span>
            </div>
            
            {/* Animated Progress Bar */}
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-border/50">
              <div
                className="bg-linear-to-r from-primary to-secondary h-full rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Insight Message */}
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 mt-3">
          <p className="text-xs text-accent-foreground">
            💡 Consider setting a budget in {topCategory.category} category to manage your spending.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
