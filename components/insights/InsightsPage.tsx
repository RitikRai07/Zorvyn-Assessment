'use client'

import { useFinance } from '@/lib/hooks/useFinance'
import { SmartInsights } from './SmartInsights'
import { MonthlyComparison } from './MonthlyComparison'
import { HighestSpendingCategory } from './HighestSpendingCategory'
import { BudgetPlanner } from '@/components/dashboard/BudgetPlanner'
import { BarChart3, Brain, Calendar } from 'lucide-react'

export function InsightsPage() {
  const { transactions } = useFinance()

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-linear-to-br from-primary to-primary/60 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Insights & Analytics
          </h2>
        </div>
        <p className="text-muted-foreground mt-2 pl-11">
          Deep dive into your spending patterns and discover actionable financial insights
        </p>
      </div>

      {/* Main Grid */}
      <div className="space-y-6">
        {/* Top Section: Highest Category & Smart Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <HighestSpendingCategory transactions={transactions} />
          </div>
          <div className="lg:col-span-2">
            <SmartInsights transactions={transactions} />
          </div>
        </div>

        {/* Budget Planning Section */}
        <div>
          <BudgetPlanner transactions={transactions} />
        </div>

        {/* Bottom Section: Monthly Comparison */}
        <div>
          <MonthlyComparison transactions={transactions} />
        </div>
      </div>

      {/* Footer Insight */}
      <div className="bg-linear-to-r from-primary/5 to-secondary/5 border border-primary/10 rounded-lg p-4 flex items-start gap-3">
        <div className="mt-0.5">
          <BarChart3 className="w-5 h-5 text-primary shrink-0" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Data Updates Automatically</p>
          <p className="text-xs text-muted-foreground mt-1">
            All insights are calculated from your transaction history. Add more transactions to get more detailed and accurate insights.
          </p>
        </div>
      </div>
    </div>
  )
}
