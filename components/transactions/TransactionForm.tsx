'use client'

import { useState, useEffect } from 'react'
import { Transaction } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void
  initialData?: Omit<Transaction, 'id'>
}

const categories = [
  { name: 'Groceries', emoji: '🛒', color: 'from-green-400 to-green-600' },
  { name: 'Transport', emoji: '🚗', color: 'from-blue-400 to-blue-600' },
  { name: 'Entertainment', emoji: '🎬', color: 'from-purple-400 to-purple-600' },
  { name: 'Utilities', emoji: '💡', color: 'from-yellow-400 to-yellow-600' },
  { name: 'Dining', emoji: '🍽️', color: 'from-orange-400 to-orange-600' },
  { name: 'Healthcare', emoji: '🏥', color: 'from-red-400 to-red-600' },
  { name: 'Shopping', emoji: '🛍️', color: 'from-pink-400 to-pink-600' },
  { name: 'Salary', emoji: '💰', color: 'from-emerald-400 to-emerald-600' },
  { name: 'Investments', emoji: '📈', color: 'from-cyan-400 to-cyan-600' },
]

export function TransactionForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: TransactionFormProps) {
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>(
    initialData || {
      date: new Date(),
      description: '',
      amount: 0,
      category: 'Groceries',
      type: 'expense',
    }
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setErrors({})
      setSuccessMessage('')
      setIsSubmitting(false)
    }
  }, [open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.description || !formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSuccessMessage('')

    try {
      // Simulate slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300))

      onSubmit(formData)
      
      setSuccessMessage(initialData ? 'Transaction updated successfully!' : 'Transaction added successfully!')
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          date: new Date(),
          description: '',
          amount: 0,
          category: 'Groceries',
          type: 'expense',
        })
        setErrors({})
        setSuccessMessage('')
        onOpenChange(false)
      }, 500)
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to submit transaction',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentCategory = categories.find(c => c.name === formData.category)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="animate-slideInRight max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {initialData ? '✏️ Edit Transaction' : '➕ Add New Transaction'}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Update the transaction details below' 
              : 'Create a new transaction to track your finances'}
          </DialogDescription>
        </DialogHeader>

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-sm text-destructive font-medium">{errors.submit}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Type Selection - Enhanced */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">💰 Transaction Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {['income', 'expense'].map((type) => (
                <Card
                  key={type}
                  onClick={() => setFormData({ ...formData, type: type as 'income' | 'expense' })}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    formData.type === type
                      ? type === 'income'
                        ? 'border-green-500 bg-green-50/50'
                        : 'border-red-500 bg-red-50/50'
                      : 'border-border hover:border-muted-foreground/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {type === 'income' ? '💵' : '💸'}
                    </span>
                    <div>
                      <div className="font-semibold capitalize">{type}</div>
                      <div className="text-xs text-muted-foreground">
                        {type === 'income' ? 'Money coming in' : 'Money going out'}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-semibold">📅 Date</Label>
            <Input
              id="date"
              type="date"
              required
              value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const newDate = new Date(e.target.value)
                setFormData({ ...formData, date: newDate })
                if (errors.date) {
                  const newErrors = { ...errors }
                  delete newErrors.date
                  setErrors(newErrors)
                }
              }}
              className={`border-2 focus:border-primary transition-colors ${
                errors.date ? 'border-destructive' : ''
              }`}
            />
            {errors.date && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.date}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">📝 Description</Label>
            <Input
              id="description"
              type="text"
              required
              placeholder="e.g., Weekly grocery shopping"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value })
                if (errors.description) {
                  const newErrors = { ...errors }
                  delete newErrors.description
                  setErrors(newErrors)
                }
              }}
              className={`border-2 focus:border-primary transition-colors ${
                errors.description ? 'border-destructive' : ''
              }`}
            />
            {errors.description && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-semibold">� Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-bold text-muted-foreground">
                ₹
              </span>
              <Input
                id="amount"
                type="number"
                required
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={formData.amount || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0
                  setFormData({ ...formData, amount: value })
                  if (errors.amount) {
                    const newErrors = { ...errors }
                    delete newErrors.amount
                    setErrors(newErrors)
                  }
                }}
                className={`border-2 pl-8 focus:border-primary transition-colors ${
                  errors.amount ? 'border-destructive' : ''
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label htmlFor="category" className="text-sm font-semibold">🏷️ Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => {
                setFormData({ ...formData, category: value })
                if (errors.category) {
                  const newErrors = { ...errors }
                  delete newErrors.category
                  setErrors(newErrors)
                }
              }}
            >
              <SelectTrigger id="category" className={`border-2 focus:border-primary ${
                errors.category ? 'border-destructive' : ''
              }`}>
                <div className="flex items-center gap-2">
                  <span>{currentCategory?.emoji || '📦'}</span>
                  <SelectValue placeholder="Select category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>
                    <div className="flex items-center gap-2">
                      <span>{cat.emoji}</span>
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.category}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-6 border-t border-border/50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-6"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 ${
              formData.type === 'income' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {initialData ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                {initialData ? '✏️ Update' : '➕ Add'} Transaction
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
