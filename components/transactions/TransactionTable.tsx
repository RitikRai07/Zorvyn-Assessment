'use client'

import { useState } from 'react'
import { Transaction, UserRole } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Edit2, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils/formatting'
import { cn } from '@/lib/utils'

interface TransactionTableProps {
  transactions: Transaction[]
  role: UserRole
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionTable({
  transactions,
  role,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const sortedTransactions = [...transactions].sort((a, b) => {
    let comparison = 0
    if (sortBy === 'date') {
      comparison = a.date.getTime() - b.date.getTime()
    } else if (sortBy === 'amount') {
      comparison = a.amount - b.amount
    } else {
      comparison = a.category.localeCompare(b.category)
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const toggleSort = (field: 'date' | 'amount' | 'category') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  if (sortedTransactions.length === 0) {
    return (
      <Card className="animate-fadeIn border-2 border-border/50 hover:border-primary/40 transition-all duration-300 shadow-lg">
        <CardHeader className="pb-6 border-b-2 border-border/30 bg-linear-to-r from-primary/5 via-secondary/5 to-transparent">
          <CardTitle className="text-lg font-bold bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            💳 My Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl opacity-50" />
              <div className="relative rounded-2xl bg-linear-to-br from-muted/60 to-muted/30 p-6">
                <ArrowDown className="w-12 h-12 text-muted-foreground/30" />
              </div>
            </div>
            <p className="text-lg font-bold text-foreground mb-2">No Transactions Yet 📭</p>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              {role === 'admin' 
                ? '🚀 Get started by adding your first transaction using the "Add Transaction" button above.'
                : '👤 No transactions to display. Ask your admin to add some transactions.'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="animate-fadeIn border-2 border-border/50 hover:border-primary/40 transition-all duration-300 overflow-hidden shadow-lg">
        <CardHeader className="pb-4 border-b-2 border-border/30 bg-linear-to-r from-primary/5 via-secondary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                💳 My Transactions
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">📊 {sortedTransactions.length} records • {role === 'admin' ? '👑 Admin View' : '👤 Viewer Only'}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border/50 bg-linear-to-r from-primary/8 via-secondary/5 to-transparent">
                  <th className="px-4 py-4 text-left">
                    <button
                      onClick={() => toggleSort('date')}
                      className="flex items-center gap-2 font-bold text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      📅 Date
                      {sortBy === 'date' && (
                        sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-4 text-left font-bold text-sm text-muted-foreground">📝 Description</th>
                  <th className="px-4 py-4 text-left">
                    <button
                      onClick={() => toggleSort('category')}
                      className="flex items-center gap-2 font-bold text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      🏷️ Category
                      {sortBy === 'category' && (
                        sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-4 text-left font-bold text-sm text-muted-foreground">💱 Type</th>
                  <th className="px-4 py-4 text-right">
                    <button
                      onClick={() => toggleSort('amount')}
                      className="flex items-center justify-end gap-2 font-bold text-sm text-muted-foreground hover:text-primary transition-colors w-full"
                    >
                      💰 Amount
                      {sortBy === 'amount' && (
                        sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  {role === 'admin' && <th className="px-4 py-4 text-right font-bold text-sm text-muted-foreground">⚙️ Actions</th>}
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((transaction, index) => (
                  <tr 
                    key={transaction.id} 
                    className="border-b border-border/20 hover:bg-linear-to-r hover:from-primary/5 hover:via-transparent hover:to-transparent transition-all duration-200 group even:bg-muted/20"
                    style={{
                      animation: `slideUp 0.3s ease-out ${index * 0.05}s backwards`
                    }}
                  >
                    <td className="px-4 py-3 font-medium text-sm whitespace-nowrap">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-4 py-3 text-sm">{transaction.description}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1">
                        {transaction.type === 'income' ? (
                          <>
                            <ArrowUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-green-600 dark:text-green-400 font-medium text-xs">Income</span>
                          </>
                        ) : (
                          <>
                            <ArrowDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <span className="text-red-600 dark:text-red-400 font-medium text-xs">Expense</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-sm">
                      <span className={transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : ''}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    {role === 'admin' && (
                      <td className="px-4 py-3 text-right space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(transaction)}
                          className="gap-1 h-8"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(transaction.id)}
                          className="gap-1 h-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-3 p-4">
            {sortedTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="bg-linear-to-r from-primary/5 to-secondary/3 rounded-lg p-4 space-y-2 border-2 border-border/40 hover:border-primary/60 transition-all duration-300 shadow-sm hover:shadow-md group"
                style={{
                  animation: `slideUp 0.3s ease-out ${index * 0.05}s backwards`
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm text-foreground truncate">
                        {transaction.description}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary shrink-0">
                        {transaction.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={cn(
                      'font-bold text-sm',
                      transaction.type === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    )}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                    <div className="flex items-center gap-1 text-xs">
                      {transaction.type === 'income' ? (
                        <>
                          <ArrowUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                          <span className="text-green-600 dark:text-green-400">Income</span>
                        </>
                      ) : (
                        <>
                          <ArrowDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                          <span className="text-red-600 dark:text-red-400">Expense</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Actions - Mobile */}
                {role === 'admin' && (
                  <div className="pt-2 border-t border-border/50 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(transaction)}
                      className="flex-1 gap-1 h-8 text-xs"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(transaction.id)}
                      className="flex-1 gap-1 h-8 text-xs text-destructive hover:text-destructive border-destructive/30"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="animate-slideInRight">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
