'use client'

import { useContext } from 'react'
import { FinanceContext } from '../context/FinanceContext'

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
