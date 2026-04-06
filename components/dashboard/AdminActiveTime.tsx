'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Clock, Activity, Zap } from 'lucide-react'
import { useFinance } from '@/lib/hooks/useFinance'

export function AdminActiveTime() {
  const { role } = useFinance()
  const [activeTime, setActiveTime] = useState<{
    hours: number
    minutes: number
    seconds: number
  }>({ hours: 0, minutes: 0, seconds: 0 })
  const [sessionStart, setSessionStart] = useState<Date | null>(null)
  const [lastActivity, setLastActivity] = useState<Date | null>(null)

  useEffect(() => {
    // Initialize session
    if (!sessionStart) {
      setSessionStart(new Date())
    }

    const updateActiveTime = () => {
      if (sessionStart) {
        const now = new Date()
        const diff = now.getTime() - sessionStart.getTime()
        
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        
        setActiveTime({ hours, minutes, seconds })
        setLastActivity(now)
      }
    }

    // Update every second
    const interval = setInterval(updateActiveTime, 1000)
    
    // Track user activity
    const handleActivity = () => {
      setLastActivity(new Date())
    }

    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keypress', handleActivity)

    return () => {
      clearInterval(interval)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keypress', handleActivity)
    }
  }, [sessionStart])

  if (role !== 'admin') {
    return null
  }

  const getActivityStatus = () => {
    if (!lastActivity) return 'Just joined'
    
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60))
    
    if (diffMinutes < 1) return '🟢 Active now'
    if (diffMinutes < 5) return '🟡 Active recently'
    return '🔴 Idle'
  }

  return (
    <Card className="border-2 border-primary/30 bg-linear-to-br from-primary/5 to-secondary/5 overflow-hidden">
      <div className="p-4 sm:p-5 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">
            Session Activity
          </h3>
        </div>

        {/* Active Time Display */}
        <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Dashboard Time</span>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-semibold">
              {getActivityStatus()}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-primary">
                {activeTime.hours.toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-muted-foreground font-semibold">h</span>
              <span className="text-xl sm:text-2xl font-bold text-foreground/80">
                {activeTime.minutes.toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-muted-foreground font-semibold">m</span>
              <span className="text-sm font-semibold text-foreground/60">
                {activeTime.seconds.toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-muted-foreground font-semibold">s</span>
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="bg-white/5 dark:bg-black/20 rounded p-2 text-center">
            <div className="text-muted-foreground">Session</div>
            <div className="font-bold text-foreground">
              {activeTime.hours > 0 ? `${activeTime.hours}h` : `${activeTime.minutes}m`}
            </div>
          </div>
          <div className="bg-white/5 dark:bg-black/20 rounded p-2 text-center hidden sm:block">
            <div className="text-muted-foreground">Productivity</div>
            <div className="font-bold text-green-600">
              {activeTime.hours > 2 ? '🚀 High' : activeTime.minutes > 10 ? '⭐ Good' : '✨ Just started'}
            </div>
          </div>
          <div className="bg-white/5 dark:bg-black/20 rounded p-2 text-center">
            <div className="text-muted-foreground">Started</div>
            <div className="font-bold text-foreground">
              {sessionStart?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Activity Tips */}
        <div className="border-t border-primary/10 pt-3 mt-3">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {activeTime.hours > 3 
                ? "Great work! Remember to take breaks 💪" 
                : "You're doing great! Keep managing your finances 🔥"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
