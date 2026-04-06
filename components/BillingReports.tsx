'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Transaction } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils/formatting'
import { Download, Filter, Eye, FileText, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface BillingReportsProps {
  transactions: Transaction[]
}

export function BillingReports({ transactions }: BillingReportsProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Filter transactions for selected month/year
  const monthTransactions = transactions.filter(t => {
    const tDate = new Date(t.date)
    return tDate.getMonth() === selectedMonth && tDate.getFullYear() === selectedYear
  })

  const monthIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const monthExpenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  const monthNet = monthIncome - monthExpenses

  // Category breakdown
  const categoryBreakdown = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  const sortedCategories = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])

  const handleExportPDF = () => {
    alert('📄 PDF export feature coming soon! For now, use CSV export.')
  }

  const handleExportJSON = () => {
    const data = {
      month: new Date(selectedYear, selectedMonth).toLocaleString('en-IN', {
        month: 'long',
        year: 'numeric',
      }),
      summary: {
        income: monthIncome,
        expenses: monthExpenses,
        net: monthNet,
      },
      transactions: monthTransactions,
    }
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `billing-report-${selectedMonth + 1}-${selectedYear}.json`
    a.click()
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            Billing & Reports
          </h2>
          <p className="text-muted-foreground">
            Monthly financial statements and reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExportPDF}
          >
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExportJSON}
          >
            <Download className="w-4 h-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Month/Year Selector */}
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-2 rounded-lg border border-border bg-background"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={i}>
                    {new Date(2024, i).toLocaleString('en-IN', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={selectedYear}
              onChange={e => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 rounded-lg border border-border bg-background"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Month Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Monthly Income</span>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(monthIncome)}
              </div>
              <div className="text-xs text-green-600/70">
                {monthTransactions.filter(t => t.type === 'income').length} transactions
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-200">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Monthly Expenses</span>
                <DollarSign className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-600">
                {formatCurrency(monthExpenses)}
              </div>
              <div className="text-xs text-red-600/70">
                {monthTransactions.filter(t => t.type === 'expense').length} transactions
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-linear-to-br border-blue-200`}>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Net Balance</span>
                <TrendingUp className={`w-5 h-5 ${monthNet >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
              </div>
              <div className={`text-3xl font-bold ${monthNet >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {monthNet >= 0 ? '+' : ''}{formatCurrency(monthNet)}
              </div>
              <div className="text-xs text-muted-foreground">
                {monthNet >= 0 ? '✅ Positive' : '⚠️ Negative'} balance
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedCategories.length > 0 ? (
            <div className="space-y-3">
              {sortedCategories.map(([category, amount], index) => (
                <div
                  key={category}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-sm font-bold">
                      #{index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{category}</p>
                      <div className="flex-1 mt-1 bg-border/50 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-linear-to-r from-primary to-secondary h-full transition-all"
                          style={{
                            width: `${(amount / monthExpenses) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-sm">{formatCurrency(amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {((amount / monthExpenses) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No expenses recorded for this month</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction List for the Month */}
      {monthTransactions.length > 0 && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />
              All Transactions ({monthTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {monthTransactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(transaction => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">
                          {transaction.description}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                            transaction.type === 'income'
                              ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{formatDate(transaction.date)}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4 whitespace-nowrap">
                      <p
                        className={`font-bold text-sm ${
                          transaction.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
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
