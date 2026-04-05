import { Transaction, Account } from '../types'

const categories = ['Groceries', 'Transport', 'Entertainment', 'Utilities', 'Dining', 'Healthcare', 'Shopping']
const merchants = {
  Groceries: ['Whole Foods', 'Trader Joes', 'Safeway', 'Costco', 'Kroger'],
  Transport: ['Uber', 'Shell Gas', 'Tesla Supercharger', 'Public Transit', 'Parking'],
  Entertainment: ['Netflix', 'Spotify', 'Movie Theater', 'Concert', 'Gaming'],
  Utilities: ['Electric Bill', 'Water Bill', 'Internet', 'Phone Bill', 'Gas'],
  Dining: ['Chipotle', 'Starbucks', 'Thai Restaurant', 'Pizza Hut', 'Sushi Bar'],
  Healthcare: ['CVS Pharmacy', 'Gym Membership', 'Doctor Visit', 'Dental', 'Lab Test'],
  Shopping: ['Amazon', 'Best Buy', 'Target', 'H&M', 'Apple Store']
}

// Seeded random number generator for consistent mock data across server/client
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  nextItem<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)]
  }
}

// Use a fixed seed based on the current date (changes daily but consistent throughout the day)
function getSeed(): number {
  const now = new Date()
  const dayString = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  return parseInt(dayString, 10)
}

export function generateMockTransactions(): Transaction[] {
  const rng = new SeededRandom(getSeed())
  const transactions: Transaction[] = []
  const baseDate = new Date()
  baseDate.setHours(0, 0, 0, 0)

  // Add salary income (2 times per month)
  for (let i = 0; i < 3; i++) {
    transactions.push({
      id: `tx-salary-${i}`,
      date: new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 15),
      description: 'Monthly Salary',
      amount: 4500,
      category: 'Salary',
      type: 'income'
    })
  }

  // Generate random expense transactions
  for (let i = 0; i < 35; i++) {
    const category = rng.nextItem(categories)
    const merchant = rng.nextItem((merchants as Record<string, string[]>)[category])
    const daysBack = rng.nextInt(1, 90)
    const date = new Date(baseDate)
    date.setDate(date.getDate() - daysBack)
    
    transactions.push({
      id: `tx-expense-${i}`,
      date,
      description: merchant,
      amount: rng.nextInt(5, 250),
      category,
      type: 'expense'
    })
  }

  // Add some investment income
  transactions.push({
    id: 'tx-investment-1',
    date: new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 1),
    description: 'Dividend Payment - ETF',
    amount: 125,
    category: 'Investments',
    type: 'income'
  })

  // Sort by date descending
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export function generateMockAccounts(): Account[] {
  return [
    {
      id: 'acc-1',
      name: 'Checking Account',
      balance: 8450
    },
    {
      id: 'acc-2',
      name: 'Savings Account',
      balance: 25000
    }
  ]
}

export function calculateTotalBalance(accounts: Account[]): number {
  return accounts.reduce((sum, acc) => sum + acc.balance, 0)
}

export function calculateTotalIncome(transactions: Transaction[], startDate?: Date, endDate?: Date): number {
  return transactions
    .filter(t => {
      if (t.type !== 'income') return false
      if (startDate && t.date < startDate) return false
      if (endDate && t.date > endDate) return false
      return true
    })
    .reduce((sum, t) => sum + t.amount, 0)
}

export function calculateTotalExpenses(transactions: Transaction[], startDate?: Date, endDate?: Date): number {
  return transactions
    .filter(t => {
      if (t.type !== 'expense') return false
      if (startDate && t.date < startDate) return false
      if (endDate && t.date > endDate) return false
      return true
    })
    .reduce((sum, t) => sum + t.amount, 0)
}

export function calculateExpensesByCategory(transactions: Transaction[]): Record<string, number> {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)
}

export function calculateMonthlyTotals(transactions: Transaction[]): Record<string, { income: number; expenses: number }> {
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

  return monthlyData
}

export function getBalanceHistory(transactions: Transaction[], accounts: Account[]): Array<{ date: string; balance: number }> {
  const startingBalance = calculateTotalBalance(accounts)
  const sortedTransactions = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime())
  
  let runningBalance = startingBalance
  const history: Array<{ date: string; balance: number }> = []

  // Add initial balance point
  if (sortedTransactions.length > 0) {
    const firstDate = new Date(sortedTransactions[0].date)
    firstDate.setDate(firstDate.getDate() - 1)
    history.push({
      date: firstDate.toISOString().split('T')[0],
      balance: startingBalance
    })
  }

  sortedTransactions.forEach(t => {
    runningBalance += t.type === 'income' ? t.amount : -t.amount
    history.push({
      date: t.date.toISOString().split('T')[0],
      balance: runningBalance
    })
  })

  return history
}
