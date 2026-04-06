export type UserRole = 'viewer' | 'admin'

export interface UserProfile {
  name: string
  role: UserRole
  avatar: string
}

export interface Transaction {
  id: string
  date: Date
  description: string
  amount: number
  category: string
  type: 'income' | 'expense'
}

export interface Account {
  id: string
  name: string
  balance: number
}

export interface Filters {
  category: string | null
  type: 'all' | 'income' | 'expense'
  startDate: Date | null
  endDate: Date | null
  searchText: string
}

export interface FinanceContextType {
  transactions: Transaction[]
  accounts: Account[]
  role: UserRole
  userProfile: UserProfile
  filters: Filters
  isDarkMode: boolean
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  setRole: (role: UserRole) => void
  setFilters: (filters: Partial<Filters>) => void
  clearFilters: () => void
  toggleDarkMode: () => void
}
