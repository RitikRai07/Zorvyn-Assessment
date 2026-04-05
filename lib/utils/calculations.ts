import { Transaction } from '../types'
import { isSameMonth } from './formatting'

export function filterTransactions(
  transactions: Transaction[],
  category?: string | null,
  type?: 'all' | 'income' | 'expense',
  startDate?: Date | null,
  endDate?: Date | null,
  searchText?: string
): Transaction[] {
  return transactions.filter(t => {
    if (category && t.category !== category) return false
    if (type && type !== 'all' && t.type !== type) return false
    if (startDate && t.date < startDate) return false
    if (endDate && t.date > endDate) return false
    if (searchText && !t.description.toLowerCase().includes(searchText.toLowerCase())) return false
    return true
  })
}

export function getTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getNetIncome(transactions: Transaction[]): number {
  return getTotalIncome(transactions) - getTotalExpenses(transactions)
}

export function getSavingsRate(transactions: Transaction[]): number {
  const income = getTotalIncome(transactions)
  if (income === 0) return 0
  return getNetIncome(transactions) / income
}

export function getExpensesByCategory(transactions: Transaction[]): Record<string, number> {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)
}

export function getTopExpenseCategory(transactions: Transaction[]): { category: string; amount: number } | null {
  const expenses = getExpensesByCategory(transactions)
  if (Object.keys(expenses).length === 0) return null

  const topCategory = Object.entries(expenses).reduce((prev, current) =>
    current[1] > prev[1] ? current : prev
  )

  return { category: topCategory[0], amount: topCategory[1] }
}

export function getMonthlyComparison(transactions: Transaction[]): Array<{
  month: string
  income: number
  expenses: number
  net: number
}> {
  const monthlyData: Record<string, { income: number; expenses: number }> = {}

  transactions.forEach(t => {
    const monthKey = `${t.date.getFullYear()}-${String(t.date.getMonth() + 1).padStart(2, '0')}`

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0 }
    }

    if (t.type === 'income') {
      monthlyData[monthKey].income += t.amount
    } else {
      monthlyData[monthKey].expenses += t.amount
    }
  })

  return Object.entries(monthlyData)
    .sort()
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses
    }))
}

export function getSpendingTrend(transactions: Transaction[]): 'increasing' | 'decreasing' | 'stable' {
  const monthly = getMonthlyComparison(transactions)
  if (monthly.length < 2) return 'stable'

  const recent = monthly.slice(-2)
  const diff = recent[1].expenses - recent[0].expenses
  const percentChange = diff / recent[0].expenses

  if (percentChange > 0.1) return 'increasing'
  if (percentChange < -0.1) return 'decreasing'
  return 'stable'
}

export function generateSmartInsights(transactions: Transaction[]): string[] {
  const insights: string[] = []
  const monthly = getMonthlyComparison(transactions)
  const topCategory = getTopExpenseCategory(transactions)
  const savingsRate = getSavingsRate(transactions)
  const trend = getSpendingTrend(transactions)

  if (monthly.length >= 2) {
    const recent = monthly.slice(-2)
    const percentChange = ((recent[1].expenses - recent[0].expenses) / recent[0].expenses) * 100

    if (percentChange > 10) {
      insights.push(`Your spending increased by ${Math.round(percentChange)}% compared to last month. Consider reviewing discretionary expenses.`)
    } else if (percentChange < -10) {
      insights.push(`Great job! You reduced spending by ${Math.round(Math.abs(percentChange))}% compared to last month.`)
    }
  }

  if (topCategory) {
    const topPercentage = (topCategory.amount / getTotalExpenses(transactions)) * 100
    insights.push(`${topCategory.category} is your highest spending category at ${Math.round(topPercentage)}% of total expenses.`)
  }

  if (savingsRate > 0.3) {
    insights.push(`Excellent savings rate of ${Math.round(savingsRate * 100)}%! You're building wealth effectively.`)
  } else if (savingsRate < 0) {
    insights.push(`Your expenses exceed income. Consider creating a budget to improve your financial health.`)
  }

  if (trend === 'increasing') {
    insights.push('Your spending trend is increasing. Set a budget target to maintain control.')
  }

  return insights
}

export function getTransactionStats(transactions: Transaction[]): {
  totalTransactions: number
  averageTransaction: number
  largestTransaction: number
} {
  const totalTransactions = transactions.length
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)
  const averageTransaction = totalTransactions > 0 ? totalAmount / totalTransactions : 0
  const largestTransaction = Math.max(...transactions.map(t => t.amount), 0)

  return { totalTransactions, averageTransaction, largestTransaction }
}
