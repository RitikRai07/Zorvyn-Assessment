'use client'

import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Card } from '@/components/ui/card'
import { Transaction } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils/formatting'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

interface TransactionToastProps {
  transaction: Omit<Transaction, 'id'>
  type: 'add' | 'update' | 'delete'
}

export function showTransactionToast(
  transaction: Omit<Transaction, 'id'>,
  type: 'add' | 'update' | 'delete' = 'add'
) {
  const { toast } = useToast()

  const icons = {
    add: '✅',
    update: '📝',
    delete: '🗑️',
  }

  const titles = {
    add: 'Transaction Added',
    update: 'Transaction Updated',
    delete: 'Transaction Deleted',
  }

  const descriptions = {
    add: `${transaction.type === 'income' ? '💰 Income' : '💸 Expense'} of ${formatCurrency(transaction.amount)}`,
    update: `Updated to ${formatCurrency(transaction.amount)}`,
    delete: `${transaction.category} transaction removed`,
  }

  toast({
    title: `${icons[type]} ${titles[type]}`,
    description: descriptions[type],
    duration: 3000,
  })
}

interface TransactionReceiptProps {
  transaction: Omit<Transaction, 'id'>
}

export function TransactionReceipt({ transaction }: TransactionReceiptProps) {
  const isIncome = transaction.type === 'income'

  return (
    <Card className={`p-4 border-2 ${isIncome ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : 'border-red-500 bg-red-50 dark:bg-red-950/30'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isIncome ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
          {isIncome ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600" />
          )}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-lg">
            {transaction.description}
          </div>
          <div className="text-sm text-muted-foreground space-y-1 mt-2">
            <p>Category: {transaction.category}</p>
            <p>Date: {formatDate(transaction.date)}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </div>
          <div className="text-xs text-muted-foreground mt-1 capitalize">
            {transaction.type}
          </div>
        </div>
      </div>
    </Card>
  )
}
