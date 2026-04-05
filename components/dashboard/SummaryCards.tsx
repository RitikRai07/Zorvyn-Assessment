'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDown, ArrowUp, Wallet, TrendingUp } from 'lucide-react'
import { Transaction } from '@/lib/types'
import { formatCurrency, formatPercent } from '@/lib/utils/formatting'
import {
  getTotalIncome,
  getTotalExpenses,
  getNetIncome,
  getSavingsRate,
} from '@/lib/utils/calculations'

interface SummaryCardsProps {
  transactions: Transaction[]
  accountBalance: number
}

export function SummaryCards({ transactions, accountBalance }: SummaryCardsProps) {
  const totalIncome = getTotalIncome(transactions)
  const totalExpenses = getTotalExpenses(transactions)
  const netIncome = getNetIncome(transactions)
  const savingsRate = getSavingsRate(transactions)

  const cards = [
    {
      title: 'Total Balance',
      value: formatCurrency(accountBalance),
      change: null,
      icon: Wallet,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/15 dark:bg-blue-500/25',
      borderColor: 'border-blue-500/30 hover:border-blue-500/60',
      gradientFrom: 'from-blue-500/20',
      gradientTo: 'to-blue-500/5',
    },
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      change: `+${formatCurrency(netIncome)}`,
      icon: ArrowUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/15 dark:bg-emerald-500/25',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
      gradientFrom: 'from-emerald-500/20',
      gradientTo: 'to-emerald-500/5',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      change: `-${formatCurrency(totalExpenses)}`,
      icon: ArrowDown,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500/15 dark:bg-orange-500/25',
      borderColor: 'border-orange-500/30 hover:border-orange-500/60',
      gradientFrom: 'from-orange-500/20',
      gradientTo: 'to-orange-500/5',
    },
    {
      title: 'Savings Rate',
      value: formatPercent(savingsRate),
      change: savingsRate > 0.2 ? 'Strong' : 'Growing',
      icon: TrendingUp,
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-500/15 dark:bg-violet-500/25',
      borderColor: 'border-violet-500/30 hover:border-violet-500/60',
      gradientFrom: 'from-violet-500/20',
      gradientTo: 'to-violet-500/5',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 animate-fadeIn">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card 
            key={index} 
            className={`group relative border-2 ${card.borderColor} transition-all duration-300 hover:shadow-2xl dark:hover:shadow-primary/10 overflow-hidden`}
          >
            {/* Gradient background overlay */}
            <div className={`absolute inset-0 bg-linear-to-br ${card.gradientFrom} ${card.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* Animated dot pattern in background */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-current" />
              <div className="absolute top-12 right-8 w-1.5 h-1.5 rounded-full bg-current" />
              <div className="absolute bottom-8 left-4 w-2 h-2 rounded-full bg-current" />
            </div>

            <CardHeader className="relative pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    {card.title}
                  </CardTitle>
                </div>
                <div className={`${card.bgColor} rounded-xl p-2.5 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-6 shadow-sm group-hover:shadow-lg`}>
                  <Icon className={`w-5 h-5 ${card.color} transition-transform duration-300`} />
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative">
              <div className="text-3xl sm:text-3xl font-black text-foreground tracking-tight leading-none group-hover:text-primary transition-colors duration-300">
                {card.value}
              </div>
              {card.change && (
                <div className="mt-3.5 flex items-center justify-between">
                  <p className={`text-xs font-bold tracking-tight ${
                    card.change.startsWith('+') 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-orange-600 dark:text-orange-400'
                  }`}>
                    {card.change}
                  </p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    card.change.startsWith('+')
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-orange-500/15 text-orange-600 dark:text-orange-400'
                  }`}>
                    {card.change.startsWith('+') ? '↑' : '↓'}
                  </span>
                </div>
              )}
            </CardContent>

            {/* Bottom accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${card.gradientFrom} ${card.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </Card>
        )
      })}

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
      `}</style>
    </div>
  )
}
