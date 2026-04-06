'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils/formatting'
import { FileText, Download, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BillingReportsProps {
  transactions: Transaction[]
}

const categoryEmojis: Record<string, string> = {
  'Groceries': '🛒',
  'Transport': '🚗',
  'Entertainment': '🎬',
  'Utilities': '💡',
  'Dining': '🍽️',
  'Healthcare': '🏥',
  'Shopping': '🛍️',
  'Salary': '💰',
  'Investments': '📈',
}

export function BillingReports({ transactions }: BillingReportsProps) {
  // Group transactions by month
  const monthlyData: Record<string, { income: number; expense: number; count: number }> = {}
  
  transactions.forEach(t => {
    const monthKey = new Date(t.date).toLocaleString('en-IN', { month: 'long', year: 'numeric' })
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0, count: 0 }
    }
    if (t.type === 'income') {
      monthlyData[monthKey].income += t.amount
    } else {
      monthlyData[monthKey].expense += t.amount
    }
    monthlyData[monthKey].count += 1
  })

  const sortedMonths = Object.entries(monthlyData).reverse()

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalTransactions = transactions.length

  const downloadFullReport = () => {
    // Create CSV with enhanced formatting
    let csvContent = '═══════════════════════════════════════════════════════\n'
    csvContent += 'ZORVYN BILLING & FINANCIAL REPORTS\n'
    csvContent += `Generated: ${new Date().toLocaleString('en-IN')}\n`
    csvContent += '═══════════════════════════════════════════════════════\n\n'

    // Summary stats
    csvContent += 'SUMMARY STATISTICS\n'
    csvContent += '───────────────────────────────────────────────────────\n'
    csvContent += `Total Transactions,${totalTransactions}\n`
    csvContent += `Total Income,₹${totalIncome.toFixed(2)}\n`
    csvContent += `Total Expenses,₹${totalExpense.toFixed(2)}\n`
    csvContent += `Net Balance,₹${(totalIncome - totalExpense).toFixed(2)}\n`
    csvContent += `Balance Status,${totalIncome - totalExpense >= 0 ? '✓ Positive' : '⚠ Negative'}\n\n`

    // Monthly breakdown with enhanced formatting
    csvContent += 'MONTHLY BREAKDOWN\n'
    csvContent += '───────────────────────────────────────────────────────\n'
    csvContent += 'Month,Income,Expenses,Net Balance,Transaction Count,Status\n'
    
    sortedMonths.forEach(([month, data]) => {
      const netBalance = data.income - data.expense
      const status = netBalance >= 0 ? '✓ Surplus' : '⚠ Deficit'
      csvContent += `"${month}","₹${data.income.toFixed(2)}","₹${data.expense.toFixed(2)}","₹${netBalance.toFixed(2)}",${data.count},"${status}"\n`
    })

    csvContent += '\n\nTOP RECENT TRANSACTIONS\n'
    csvContent += '───────────────────────────────────────────────────────\n'
    csvContent += 'Date,Time,Description,Category,Type,Amount\n'
    
    transactions.slice(0, 10).forEach(t => {
      const dateObj = new Date(t.date)
      const timeStr = dateObj.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
      csvContent += `"${formatDate(t.date)}","${timeStr}","${t.description}","${t.category}","${t.type.toUpperCase()}","₹${t.amount.toFixed(2)}"\n`
    })

    csvContent += '\n═══════════════════════════════════════════════════════\n'
    csvContent += `Report Generated: ${new Date().toLocaleString('en-IN')}\n`
    csvContent += 'Format: Comprehensive Financial Report\n'

    // Create and download
    const element = document.createElement('a')
    element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`)
    element.setAttribute('download', `Billing_Report_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.csv`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            Billing & Reports
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Complete financial history and reports</p>
        </div>
        <Button 
          onClick={downloadFullReport} 
          className="gap-2 bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <Download className="w-5 h-5" />
          📊 Download Report (CSV)
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-semibold">Total Transactions</p>
              <p className="text-3xl font-black text-blue-600">{totalTransactions}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200/50 dark:border-green-800/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-semibold">Total Income</p>
              <p className="text-3xl font-black text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200/50 dark:border-red-800/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-semibold">Total Expenses</p>
              <p className="text-3xl font-black text-red-600">{formatCurrency(totalExpense)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-semibold">Net Balance</p>
              <p className={`text-3xl font-black ${totalIncome - totalExpense >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                {formatCurrency(totalIncome - totalExpense)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card className="border-2 border-primary/30">
        <CardHeader className="bg-linear-to-r from-primary/10 to-secondary/5 pb-4">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Monthly Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50 overflow-x-auto">
            {/* Header */}
            <div className="hidden md:grid md:grid-cols-5 gap-4 sticky top-0 bg-background/95 backdrop-blur-sm px-6 py-3 font-semibold text-sm text-muted-foreground border-b-2 border-primary/10 z-10">
              <div>Month</div>
              <div className="text-right">💰 Income</div>
              <div className="text-right">💸 Expenses</div>
              <div className="text-right">📊 Net</div>
              <div className="text-right">🔢 Transactions</div>
            </div>

            {/* Rows */}
            {sortedMonths.map(([month, data], index) => (
              <div key={month} className="group hover:bg-accent/30 transition-colors px-4 sm:px-6 py-4">
                <div className="hidden md:grid md:grid-cols-5 gap-4 items-center">
                  <div className="font-semibold text-foreground">{month}</div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 text-sm font-bold">
                      +{formatCurrency(data.income)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 text-sm font-bold">
                      -{formatCurrency(data.expense)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${data.income - data.expense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(data.income - data.expense)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-sm font-bold">
                      {data.count}
                    </span>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/30">
                    <h4 className="font-bold text-lg text-foreground">{month}</h4>
                    <span className="text-sm font-semibold text-muted-foreground">{data.count} transactions</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">💰 Income</span>
                      <span className="text-sm font-bold text-green-600">+{formatCurrency(data.income)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">💸 Expenses</span>
                      <span className="text-sm font-bold text-red-600">-{formatCurrency(data.expense)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <span className="text-sm font-semibold text-foreground">📊 Net</span>
                      <span className={`text-sm font-bold ${data.income - data.expense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(data.income - data.expense)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions Summary */}
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <CardTitle>Recent Transactions Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{categoryEmojis[transaction.category] || '💳'}</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{transaction.category}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
