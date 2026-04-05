'use client'

import React from 'react'
import { FinanceProvider } from '@/lib/context/FinanceContext'

export function FinanceProviderWrapper({ children }: { children: React.ReactNode }) {
  return <FinanceProvider>{children}</FinanceProvider>
}
