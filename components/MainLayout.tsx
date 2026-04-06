'use client'

import { useFinance } from '@/lib/hooks/useFinance'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { FloatingChatbot } from './FloatingChatbot'
import { FloatingGoalsPanel } from './FloatingGoalsPanel'
import { SessionActivityIndicator } from './SessionActivityIndicator'
import { InactivityWarning } from './InactivityWarning'
import { useSessionActivity } from '@/hooks/useSessionActivity'
import { useState, useCallback } from 'react'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { transactions, role } = useFinance()
  const [showWarning, setShowWarning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  // Session configuration: 15 seconds warning, 10 minutes total
  const { isInactive, resetInactivityTimer } = useSessionActivity({
    inactivityWarningTime: 15000, // 15 seconds
    autoLogoutTime: 600000, // 10 minutes
    onInactivityWarning: () => {
      setShowWarning(true)
      setTimeRemaining(Math.ceil((600000 - 15000) / 1000)) // Remaining time in seconds
    },
    onAutoLogout: () => {
      setShowWarning(false)
      // Redirect to logout or reset session
      window.location.href = '/'
    },
  })

  const handleContinueSession = useCallback(() => {
    setShowWarning(false)
    resetInactivityTimer()
  }, [resetInactivityTimer])

  const handleLogout = useCallback(() => {
    setShowWarning(false)
    window.location.href = '/'
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8 animate-fadeIn">
            {children}
          </div>
        </main>
      </div>

      {/* Inactivity Warning Dialog */}
      <InactivityWarning 
        isOpen={showWarning}
        timeRemaining={timeRemaining}
        onContinue={handleContinueSession}
        onLogout={handleLogout}
      />

      {/* Session Activity Indicator - Floating */}
      <SessionActivityIndicator 
        isInactive={isInactive}
        timeUntilLogout={timeRemaining || 0}
      />

      {/* Floating Chatbot - Always Visible */}
      <FloatingChatbot transactions={transactions} role={role} />

      {/* Floating Goals Panel - Always Visible */}
      <FloatingGoalsPanel />
    </div>
  )
}
