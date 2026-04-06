'use client'

import React, { createContext, useCallback, useEffect, useState } from 'react'
import { Transaction, Account, Filters, UserRole, FinanceContextType, UserProfile } from '../types'
import { generateMockTransactions, generateMockAccounts } from '../utils/mockData'

const defaultFilters: Filters = {
  category: null,
  type: 'all',
  startDate: null,
  endDate: null,
  searchText: ''
}

const defaultUserProfile: Record<UserRole, UserProfile> = {
  admin: {
    name: 'Harshita',
    role: 'admin',
    avatar: '👑',
  },
  viewer: {
    name: 'Viewer',
    role: 'viewer',
    avatar: '👁️',
  },
}

export const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  // Initialize with mock data - same on server and client
  const [transactions, setTransactions] = useState<Transaction[]>(() => generateMockTransactions())
  const [accounts, setAccounts] = useState<Account[]>(() => generateMockAccounts())
  const [role, setRole] = useState<UserRole>('viewer')
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile['viewer'])
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage after client mounts
  useEffect(() => {
    const savedTransactions = localStorage.getItem('finance_transactions')
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions).map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }))
        setTransactions(parsed)
      } catch (e) {
        console.error('Failed to load transactions from localStorage', e)
      }
    }

    const savedRole = localStorage.getItem('finance_role') as UserRole | null
    if (savedRole) {
      setUserProfile(defaultUserProfile[savedRole])
      setRole(savedRole)
    }

    const savedDarkMode = localStorage.getItem('finance_darkMode')
    const isDark = savedDarkMode === 'true'
    setIsDarkMode(isDark)
    
    // Apply dark mode to document
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    setIsHydrated(true)
  }, [])

  // Update document dark mode class when isDarkMode changes (but not on initial hydration)
  useEffect(() => {
    if (isHydrated) {
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [isDarkMode, isHydrated])

  // Persist transactions
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('finance_transactions', JSON.stringify(transactions))
    }
  }, [transactions, isHydrated])

  // Persist role
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('finance_role', role)
    }
  }, [role, isHydrated])

  // Persist dark mode
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('finance_darkMode', isDarkMode.toString())
    }
  }, [isDarkMode, isHydrated])

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    setTransactions(prev => [newTransaction, ...prev])
  }, [])

  const updateTransaction = useCallback((id: string, transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...transaction, id } : t))
    )
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }, [])

  const handleSetRole = useCallback((newRole: UserRole) => {
    setUserProfile(defaultUserProfile[newRole])
    setRole(newRole)
  }, [])

  const handleSetFilters = useCallback((newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev)
  }, [])

  const value: FinanceContextType = {
    transactions,
    userProfile,
    accounts,
    role,
    filters,
    isDarkMode,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setRole: handleSetRole,
    setFilters: handleSetFilters,
    clearFilters: handleClearFilters,
    toggleDarkMode
  }

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}
