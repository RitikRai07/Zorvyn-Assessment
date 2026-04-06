'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '@/lib/types'
import { formatCurrency } from '@/lib/utils/formatting'
import { Progress } from '@/components/ui/progress'
import { Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

interface BudgetPlannerProps {
  transactions: Transaction[]
}

const suggestedBudgets: Record<string, number> = {
  'Groceries': 5000,
  'Transport': 3000,
  'Entertainment': 2000,
  'Utilities': 2500,
  'Dining': 3000,
  'Healthcare': 2000,
  'Shopping': 4000,
  'Salary': 0, // Income
  'Investments': 0, // Income
}

type BudgetStatus = 'good' | 'warning' | 'danger'

const statusColors: Record<BudgetStatus, string> = {
  good: 'text-green-600 dark:text-green-400',
  warning: 'text-orange-600 dark:text-orange-400',
  danger: 'text-red-600 dark:text-red-400',
}

const statusBg: Record<BudgetStatus, string> = {
  good: 'bg-green-50 dark:bg-green-950/30',
  warning: 'bg-orange-50 dark:bg-orange-950/30',
  danger: 'bg-red-50 dark:bg-red-950/30',
}

export function BudgetPlanner({ transactions }: BudgetPlannerProps) {
  const now = new Date()
  const currentMonth = transactions.filter(t => {
    const tDate = new Date(t.date)
    return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear()
  })

  // Calculate spending by category
  const categorySpending = currentMonth
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const budgetItems: Array<{
    category: string
    budget: number
    spent: number
    remaining: number
    percentUsed: number
    status: BudgetStatus
  }> = Object.entries(suggestedBudgets)
    .filter(([category]) => category !== 'Salary' && category !== 'Investments')
    .map(([category, budget]) => {
      const spent = categorySpending[category] || 0
      const remaining = budget - spent
      const percentUsed = (spent / budget) * 100

      const status: BudgetStatus = percentUsed < 80 ? 'good' : percentUsed < 100 ? 'warning' : 'danger'

      return {
        category,
        budget,
        spent,
        remaining,
        percentUsed: Math.min(100, percentUsed),
        status,
      }
    })

  const totalBudget = Object.values(suggestedBudgets)
    .filter((_, i) => i < Object.keys(suggestedBudgets).length - 2)
    .reduce((sum, b) => sum + b, 0)
  const totalSpent = Object.values(categorySpending).reduce((sum, s) => sum + s, 0)
  const overallPercentUsed = (totalSpent / totalBudget) * 100



  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overall Budget Summary */}
      <Card className="border-2 border-primary/30 overflow-hidden">
        <CardHeader className="bg-linear-to-r from-primary/10 to-secondary/10">
          <CardTitle className="text-lg font-bold">📊 Overall Budget Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className={`text-3xl font-bold ${totalSpent > totalBudget ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className={`text-3xl font-bold ${totalSpent > totalBudget ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(Math.max(0, totalBudget - totalSpent))}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Overall Usage</span>
              <span className={`text-sm font-bold ${
                overallPercentUsed < 80 ? 'text-green-600' : overallPercentUsed < 100 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {overallPercentUsed.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={Math.min(100, overallPercentUsed)} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {budgetItems.map((item) => (
          <Card key={item.category} className={`border-2 border-border/50 ${statusBg[item.status]}`}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">{item.category}</h4>
                  <div className={`flex items-center gap-1 ${statusColors[item.status]}`}>
                    {item.status === 'good' && <CheckCircle className="w-4 h-4" />}
                    {item.status === 'warning' && <AlertTriangle className="w-4 h-4" />}
                    {item.status === 'danger' && <AlertTriangle className="w-4 h-4" />}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Budget</p>
                      <p className="font-semibold">{formatCurrency(item.budget)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Spent</p>
                      <p className="font-semibold text-orange-600">{formatCurrency(item.spent)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Left</p>
                      <p className={`font-semibold ${item.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(Math.max(0, item.remaining))}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className={`text-xs font-semibold ${statusColors[item.status]}`}>
                        {item.percentUsed.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={item.percentUsed} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
