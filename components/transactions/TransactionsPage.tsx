'use client'

import { useState } from 'react'
import { useFinance } from '@/lib/hooks/useFinance'
import { Button } from '@/components/ui/button'
import { Transaction } from '@/lib/types'
import { TransactionFilters } from './TransactionFilters'
import { TransactionsPremiumTable } from './TransactionsPremiumTable'
import { TransactionForm } from './TransactionForm'
import { filterTransactions } from '@/lib/utils/calculations'
import { Plus, ArrowRightLeft, TrendingUp, TrendingDown, Wallet } from 'lucide-react'

export function TransactionsPage() {
  const {
    transactions,
    role,
    filters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useFinance()

  const [formOpen, setFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const filteredTransactions = filterTransactions(
    transactions,
    filters.category,
    filters.type,
    filters.startDate,
    filters.endDate,
    filters.searchText
  )

  // Calculate stats
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  const netBalance = totalIncome - totalExpense

  const handleAddTransaction = (data: Omit<Transaction, 'id'>) => {
    addTransaction(data)
  }

  const handleUpdateTransaction = (data: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data)
      setEditingTransaction(null)
    }
  }

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormOpen(true)
  }

  const handleFormSubmit = (data: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      handleUpdateTransaction(data)
    } else {
      handleAddTransaction(data)
    }
  }

  const handleFormOpenChange = (open: boolean) => {
    if (!open) {
      setEditingTransaction(null)
    }
    setFormOpen(open)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-linear-to-br from-primary to-primary/60 rounded-lg">
                <ArrowRightLeft className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Transactions
              </h2>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base pl-11">
              View and manage your financial transactions
            </p>
          </div>
          {role === 'admin' && (
            <Button
              onClick={() => {
                setEditingTransaction(null)
                setFormOpen(true)
              }}
              className="gap-2 w-full sm:w-auto"
              size="lg"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </Button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-muted/30 border border-border/50 rounded-lg p-3 sm:p-4 hover:border-green-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Income</p>
            </div>
            <p className="text-lg sm:text-xl font-bold text-green-600">
              ${(totalIncome / 1000).toFixed(1)}k
            </p>
          </div>
          <div className="bg-muted/30 border border-border/50 rounded-lg p-3 sm:p-4 hover:border-red-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Expenses</p>
            </div>
            <p className="text-lg sm:text-xl font-bold text-red-600">
              ${(totalExpense / 1000).toFixed(1)}k
            </p>
          </div>
          <div className={`bg-muted/30 border rounded-lg p-3 sm:p-4 transition-colors ${
            netBalance >= 0 
              ? 'border-green-500/30 hover:border-green-500/50' 
              : 'border-red-500/30 hover:border-red-500/50'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Wallet className={`w-4 h-4 ${netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Net</p>
            </div>
            <p className={`text-lg sm:text-xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${(netBalance / 1000).toFixed(1)}k
            </p>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <TransactionFilters transactions={transactions} />

      {/* Transactions Table */}
      <TransactionsPremiumTable
        transactions={filteredTransactions}
        role={role}
        onEdit={handleEditClick}
        onDelete={deleteTransaction}
      />

      {/* Transaction Form Dialog */}
      <TransactionForm
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleFormSubmit}
        initialData={editingTransaction ? {
          date: editingTransaction.date,
          description: editingTransaction.description,
          amount: editingTransaction.amount,
          category: editingTransaction.category,
          type: editingTransaction.type,
        } : undefined}
      />
    </div>
  )
}
