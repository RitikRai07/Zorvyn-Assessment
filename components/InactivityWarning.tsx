'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RotateCcw, X } from 'lucide-react'

interface InactivityWarningProps {
  isOpen: boolean
  timeRemaining: number
  onContinue: () => void
  onLogout: () => void
  onDismiss?: () => void
}

export function InactivityWarning({
  isOpen,
  timeRemaining,
  onContinue,
  onLogout,
  onDismiss,
}: InactivityWarningProps) {
  const [displayTime, setDisplayTime] = useState(timeRemaining)
  const [visible, setVisible] = useState(isOpen)

  useEffect(() => {
    setVisible(isOpen)
    setDisplayTime(timeRemaining)
  }, [isOpen, timeRemaining])

  useEffect(() => {
    if (!visible) return

    const timer = setInterval(() => {
      setDisplayTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onLogout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [visible, onLogout])

  if (!visible) return null

  return (
    <div className="fixed top-6 right-6 z-50 w-full max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="border-2 border-orange-500/60 bg-gradient-to-br from-orange-50/95 to-red-50/80 dark:from-orange-950/80 dark:to-red-950/60 backdrop-blur-xl shadow-2xl rounded-2xl p-5 flex flex-col gap-4">
        {/* Header with close button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-lg bg-orange-600/20 border border-orange-500/30 flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-orange-700 dark:text-orange-300">⚠️ Inactive</h3>
            </div>
          </div>
          <button
            onClick={() => {
              setVisible(false)
              onDismiss?.()
            }}
            className="flex-shrink-0 p-1.5 hover:bg-orange-200/50 dark:hover:bg-orange-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3">
          <p className="text-sm text-foreground/80 font-semibold">
            No activity for 15 seconds. Logout in:
          </p>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-red-600/20 border border-red-500/40 text-red-700 dark:text-red-300 font-mono font-bold text-lg">
              {displayTime}s
            </div>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-600 to-red-600 transition-all duration-500"
                style={{ width: `${(displayTime / timeRemaining) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onContinue}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-2.5 rounded-lg transition-all hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Continue
          </button>
          <button
            onClick={onLogout}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-2.5 rounded-lg transition-all hover:scale-105 active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
