'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react'

interface SessionActivityIndicatorProps {
  isInactive?: boolean
  timeUntilLogout?: number
}

export function SessionActivityIndicator({ isInactive = false, timeUntilLogout = 0 }: SessionActivityIndicatorProps) {
  const [displayTime, setDisplayTime] = useState<{ h: string; m: string; s: string }>({ h: '00', m: '00', s: '00' })
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const hours = Math.floor(timeUntilLogout / 3600)
      const minutes = Math.floor((timeUntilLogout % 3600) / 60)
      const seconds = timeUntilLogout % 60

      setDisplayTime({
        h: String(hours).padStart(2, '0'),
        m: String(minutes).padStart(2, '0'),
        s: String(seconds).padStart(2, '0')
      })
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [timeUntilLogout])

  if (!mounted) return null

  const startTime = new Date()
  const sessionStarted = startTime.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  })

  return (
    <div className="fixed top-24 right-6 z-40 max-w-xs w-full sm:max-w-xs">
      {/* Floating Session Activity Indicator - Compact */}
      <div className={`
        border border-blue-300/40 dark:border-blue-700/40
        bg-linear-to-br from-white/90 to-blue-50/80
        dark:from-slate-900/80 dark:to-blue-950/30
        backdrop-blur-lg rounded-lg shadow-lg
        transition-all duration-300
        ${isExpanded ? 'max-h-40' : 'max-h-16'}
        overflow-hidden
      `}>
        {/* Header - Always Visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 text-left">
            <div className={`p-2 rounded-lg border transition-colors ${
              isInactive 
                ? 'bg-orange-500/20 border-orange-500/40 animate-pulse' 
                : 'bg-blue-500/20 border-blue-500/30'
            }`}>
              <AlertCircle className={`w-5 h-5 ${isInactive ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground">Session Activity</p>
              <p className={`text-xs font-mono font-bold ${
                isInactive 
                  ? 'text-orange-600 dark:text-orange-400' 
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {displayTime.h}:{displayTime.m}:{displayTime.s}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Expanded Content - Compact */}
        {isExpanded && (
          <div className="border-t border-blue-200/50 dark:border-blue-800/30 px-3 py-2 space-y-2 bg-linear-to-b from-blue-50/30 to-transparent dark:from-blue-900/10">
            {/* Time Display - Compact Grid */}
            <div className="grid grid-cols-3 gap-1 text-center font-mono text-xs">
              <div className="bg-blue-100/40 dark:bg-blue-900/20 rounded py-1.5 border border-blue-200/40 dark:border-blue-800/30">
                <p className="font-black text-blue-700 dark:text-blue-400">{displayTime.h}</p>
                <p className="text-xs text-muted-foreground font-bold mt-0.5">h</p>
              </div>
              <div className="bg-blue-100/40 dark:bg-blue-900/20 rounded py-1.5 border border-blue-200/40 dark:border-blue-800/30">
                <p className="font-black text-blue-700 dark:text-blue-400">{displayTime.m}</p>
                <p className="text-xs text-muted-foreground font-bold mt-0.5">m</p>
              </div>
              <div className="bg-blue-100/40 dark:bg-blue-900/20 rounded py-1.5 border border-blue-200/40 dark:border-blue-800/30">
                <p className="font-black text-blue-700 dark:text-blue-400">{displayTime.s}</p>
                <p className="text-xs text-muted-foreground font-bold mt-0.5">s</p>
              </div>
            </div>

            {/* Session Info - Compact */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between p-1.5 rounded text-muted-foreground font-semibold">
                <span>Status:</span>
                <span className={`px-1.5 py-0.5 rounded-full font-bold text-white text-xs ${
                  isInactive 
                    ? 'bg-orange-600 animate-pulse' 
                    : 'bg-green-600'
                }`}>
                  {isInactive ? '⚠️ Inactive' : '✓ Active'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
