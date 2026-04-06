'use client'

import { useFinance } from '@/lib/hooks/useFinance'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { X, Filter, Search } from 'lucide-react'
import { Transaction } from '@/lib/types'

interface TransactionFiltersProps {
  transactions: Transaction[]
}

const categories = [
  { name: 'Groceries', emoji: '🛒' },
  { name: 'Transport', emoji: '🚗' },
  { name: 'Entertainment', emoji: '🎬' },
  { name: 'Utilities', emoji: '💡' },
  { name: 'Dining', emoji: '🍽️' },
  { name: 'Healthcare', emoji: '🏥' },
  { name: 'Shopping', emoji: '🛍️' },
  { name: 'Salary', emoji: '💰' },
  { name: 'Investments', emoji: '📈' },
]

export function TransactionFilters({ transactions }: TransactionFiltersProps) {
  const { filters, setFilters, clearFilters } = useFinance()

  const handleCategoryChange = (value: string) => {
    setFilters({ category: value === 'all' ? null : value })
  }

  const handleTypeChange = (value: string) => {
    setFilters({ type: value as 'all' | 'income' | 'expense' })
  }

  const handleSearchChange = (value: string) => {
    setFilters({ searchText: value })
  }

  const hasActiveFilters = filters.category || filters.type !== 'all' || filters.searchText

  return (
    <Card className="animate-fadeIn border-border/50 overflow-hidden group">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary shrink-0" />
            <CardTitle>Filters & Search</CardTitle>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-2 text-xs sm:text-sm"
            >
              <X className="w-4 h-4" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-tight">
              Category
            </label>
            <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.emoji} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-tight">
              Type
            </label>
            <Select value={filters.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Filter */}
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <label className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-tight flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              Search
            </label>
            <Input
              placeholder="Search description..."
              value={filters.searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-10 text-sm transition-all duration-300 border-border/50 focus-visible:border-primary/50"
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-border/30 flex flex-wrap gap-2">
            {filters.category && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                {filters.category}
                <button
                  onClick={() => setFilters({ category: null })}
                  className="hover:text-primary/70 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.type !== 'all' && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 capitalize">
                {filters.type}
                <button
                  onClick={() => setFilters({ type: 'all' })}
                  className="hover:text-primary/70 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.searchText && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 truncate max-w-xs">
                "{filters.searchText}"
                <button
                  onClick={() => setFilters({ searchText: '' })}
                  className="hover:text-primary/70 transition-colors shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
