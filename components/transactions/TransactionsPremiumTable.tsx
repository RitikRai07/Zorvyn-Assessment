'use client'

import { Transaction, UserRole } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Download, Filter, Search as SearchIcon } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils/formatting'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface TransactionsPremiumTableProps {
  transactions: Transaction[]
  role: UserRole
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  isViewerMode?: boolean
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

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Groceries': { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  'Transport': { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  'Entertainment': { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  'Utilities': { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800' },
  'Dining': { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
  'Healthcare': { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
  'Shopping': { bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-700 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' },
  'Salary': { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  'Investments': { bg: 'bg-cyan-50 dark:bg-cyan-950/30', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800' },
}

export function TransactionsPremiumTable({
  transactions,
  role,
  onEdit,
  onDelete,
  isViewerMode = false,
}: TransactionsPremiumTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')

  const filteredTransactions = transactions
    .filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return b.amount - a.amount
      }
    })

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const downloadPDF = () => {
    // Create enhanced CSV content
    let csvContent = '═══════════════════════════════════════════════════\n'
    csvContent += 'ZORVYN - TRANSACTION EXPORT REPORT\n'
    csvContent += `Generated: ${new Date().toLocaleString('en-IN')}\n`
    csvContent += '═══════════════════════════════════════════════════\n\n'

    // Summary
    csvContent += 'FILTERED SUMMARY\n'
    csvContent += '───────────────────────────────────────────────────\n'
    csvContent += `Total Records,${filteredTransactions.length}\n`
    csvContent += `Total Income,₹${totalIncome.toFixed(2)}\n`
    csvContent += `Total Expenses,₹${totalExpense.toFixed(2)}\n`
    csvContent += `Net Balance,₹${(totalIncome - totalExpense).toFixed(2)}\n\n`

    csvContent += 'TRANSACTION DETAILS\n'
    csvContent += '───────────────────────────────────────────────────\n'
    csvContent += 'Date,Time,Description,Category,Type,Amount\n'
    
    filteredTransactions.forEach(t => {
      const dateObj = new Date(t.date)
      const timeStr = dateObj.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
      csvContent += `"${formatDate(t.date)}","${timeStr}","${t.description}","${t.category}","${t.type.toUpperCase()}","₹${t.amount.toFixed(2)}"\n`
    })

    csvContent += '\n═══════════════════════════════════════════════════\n'
    csvContent += `Export Date: ${new Date().toLocaleString('en-IN')}\n`

    // Create and download
    const element = document.createElement('a')
    element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`)
    element.setAttribute('download', `Transactions_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.csv`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Total Records</p>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {filteredTransactions.length}
                </p>
              </div>
              <Filter className="w-10 h-10 text-blue-600/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Total Income</p>
                <p className="text-3xl font-black text-green-600 dark:text-green-400">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <span className="text-4xl">💰</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/20 dark:to-red-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold">Total Expenses</p>
                <p className="text-3xl font-black text-red-600 dark:text-red-400">
                  {formatCurrency(totalExpense)}
                </p>
              </div>
              <span className="text-4xl">💸</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Transactions Card */}
      <Card className="border-2 border-primary/30 overflow-hidden">
        {/* Header with gradient */}
        <CardHeader className="bg-linear-to-r from-primary/10 via-secondary/5 to-transparent border-b-2 border-primary/10 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-black">💳 My Transactions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {role === 'admin' ? '👑 Admin View' : '👤 Viewer Mode'} • {filteredTransactions.length} records
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={downloadPDF}
                variant="default"
                size="sm"
                className="gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 border-0"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download CSV</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-primary/10">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search description or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 focus:border-primary/50"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'date' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('date')}
                className="border-2"
              >
                📅 Date
              </Button>
              <Button
                variant={sortBy === 'amount' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('amount')}
                className="border-2"
              >
                💰 Amount
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Transactions List */}
        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-lg font-bold text-foreground">No Transactions Found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50 overflow-x-auto">
              {/* Desktop Table Header */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 sticky top-0 bg-background/95 backdrop-blur-sm px-6 py-3 font-semibold text-sm text-muted-foreground border-b-2 border-primary/10 z-10">
                <div className="col-span-2">📅 Date</div>
                <div className="col-span-3">📝 Description</div>
                <div className="col-span-2">🏷️ Category</div>
                <div className="col-span-2">💱 Type</div>
                <div className="col-span-2">💰 Amount</div>
                {role === 'admin' && <div className="col-span-1">⚙️ Actions</div>}
              </div>

              {/* Transaction Rows */}
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="group hover:bg-accent/30 transition-colors duration-200 px-4 sm:px-6 py-4"
                >
                  {/* Desktop View */}
                  <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                    {/* Date */}
                    <div className="col-span-2">
                      <span className="text-sm font-semibold text-foreground">
                        {formatDate(transaction.date)}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="col-span-3">
                      <p className="font-medium text-foreground truncate">
                        {transaction.description}
                      </p>
                    </div>

                    {/* Category */}
                    <div className="col-span-2">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${categoryColors[transaction.category]?.bg} ${categoryColors[transaction.category]?.border}`}>
                        <span className="text-lg">{categoryEmojis[transaction.category] || '📌'}</span>
                        <span className={`text-sm font-semibold ${categoryColors[transaction.category]?.text}`}>
                          {transaction.category}
                        </span>
                      </div>
                    </div>

                    {/* Type */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${
                        transaction.type === 'income'
                          ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                      }`}>
                        {transaction.type === 'income' ? '📈' : '📉'} {transaction.type.toUpperCase()}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="col-span-2">
                      <span className={`text-lg font-black ${
                        transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>

                    {/* Actions */}
                    {role === 'admin' && (
                      <div className="col-span-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(transaction)}
                          className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(transaction.id)}
                          className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/50"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Mobile View */}
                  <div className="lg:hidden">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-muted-foreground mb-1">
                          {formatDate(transaction.date)}
                        </p>
                        <h4 className="font-bold text-foreground text-sm">
                          {transaction.description}
                        </h4>
                      </div>
                      <span className={`text-lg font-black whitespace-nowrap ml-2 ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-2">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${categoryColors[transaction.category]?.bg} ${categoryColors[transaction.category]?.text} border ${categoryColors[transaction.category]?.border}`}>
                          <span>{categoryEmojis[transaction.category] || '📌'}</span>
                          <span>{transaction.category}</span>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-bold rounded border ${
                          transaction.type === 'income'
                            ? 'text-green-600 border-green-600/30'
                            : 'text-red-600 border-red-600/30'
                        }`}>
                          {transaction.type === 'income' ? '📈' : '📉'}
                        </span>
                      </div>
                      {role === 'admin' && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(transaction)}
                            className="h-7 w-7 p-0"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(transaction.id)}
                            className="h-7 w-7 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
