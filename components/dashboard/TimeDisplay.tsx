'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, AlertCircle } from 'lucide-react'

interface TimeDisplayProps {
  isInactive?: boolean
  timeUntilLogout?: number
}

export function TimeDisplay({ isInactive = false, timeUntilLogout = 0 }: TimeDisplayProps) {
  const [dateTime, setDateTime] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateDateTime = () => {
      const now = new Date()
      
      const dateFormatter = new Intl.DateTimeFormat('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Kolkata'
      })
      
      const timeFormatter = new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      })
      
      setDateTime(dateFormatter.format(now))
      setTime(timeFormatter.format(now))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="relative group overflow-hidden rounded-2xl">
      {/* Advanced multi-layer background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/3 via-transparent to-violet-400/3" />
      
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 backdrop-blur-3xl opacity-50" />
      
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/50 via-purple-500/30 to-pink-500/50 bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 rounded-2xl border-2 border-primary/40 group-hover:border-primary/30 transition-colors duration-300" />
      
      {/* Shimmer effect */}
      <div className="absolute -inset-full top-0 h-1/2 w-1/2 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
      
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute top-5 left-5 w-2 h-2 bg-blue-400/40 rounded-full animate-float blur-sm" />
        <div className="absolute top-1/3 right-10 w-3 h-3 bg-purple-400/30 rounded-full animate-float animation-delay-2 blur-sm" />
        <div className="absolute bottom-10 left-1/4 w-2.5 h-2.5 bg-cyan-400/25 rounded-full animate-float animation-delay-4 blur-sm" />
        <div className="absolute bottom-5 right-1/3 w-2 h-2 bg-pink-400/35 rounded-full animate-float animation-delay-3 blur-sm" />
      </div>

      {/* Main content with glass background - COMPACT */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 px-5 sm:px-6 py-5 sm:py-6 bg-white/5 dark:bg-black/5 backdrop-blur-xl rounded-2xl border border-white/10 dark:border-white/5">
        {/* Date Section with premium styling - COMPACT */}
        <div className="flex items-center gap-3 flex-1 group/date min-w-0">
          <div className="relative p-2.5 rounded-xl shadow-xl flex-shrink-0 group-hover/date:scale-110 transition-transform duration-300">
            {/* Gradient background for icon */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/40 to-cyan-500/20 blur-xl opacity-75 group-hover/date:opacity-100 transition-opacity" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/50 to-cyan-400/30 opacity-75" />
            
            {/* Icon container with ring */}
            <div className="relative ring-2 ring-blue-500/50 group-hover/date:ring-blue-500/80 rounded-xl p-2 transition-all">
              <Calendar className="w-5 h-5 text-white drop-shadow-lg" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-xs font-bold uppercase tracking-tight text-foreground/70">📅 Date</label>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500/30 to-cyan-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/40 shadow-lg hidden sm:inline-block">
                ✓ Live
              </span>
            </div>
            <p className="text-sm sm:text-base font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm line-clamp-1">
              {dateTime}
            </p>
          </div>
        </div>
        
        {/* Premium divider - COMPACT */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          <div className="h-16 w-0.5 rounded-full bg-gradient-to-b from-primary/50 via-primary/20 to-transparent shadow-lg" />
          <div className="flex flex-col gap-0.5">
            <div className="w-2 h-2 rounded-full bg-primary/60 ring-2 ring-primary/40 shadow-lg animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <div className="w-2 h-2 rounded-full bg-primary/60 ring-2 ring-primary/40 shadow-lg animate-pulse animation-delay-2" />
          </div>
          <div className="h-16 w-0.5 rounded-full bg-gradient-to-t from-primary/50 via-primary/20 to-transparent shadow-lg" />
        </div>
        
        {/* Time Section with premium styling - COMPACT */}
        <div className="flex items-center gap-3 flex-1 group/time min-w-0">
          <div className="relative p-2.5 rounded-xl shadow-xl flex-shrink-0 group-hover/time:scale-110 transition-transform duration-300">
            {/* Gradient background for icon */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/40 to-violet-500/20 blur-xl opacity-75 group-hover/time:opacity-100 transition-opacity" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/50 to-violet-400/30 opacity-75" />
            
            {/* Icon container with ring */}
            <div className="relative ring-2 ring-purple-500/50 group-hover/time:ring-purple-500/80 rounded-xl p-2 transition-all">
              <Clock className="w-5 h-5 text-white drop-shadow-lg" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <label className="text-xs font-bold uppercase tracking-tight text-foreground/70">🕐 Time (IST)</label>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500/30 to-violet-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40 shadow-lg flex items-center gap-1 hidden sm:inline-flex">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-lg" />
                Live
              </span>
            </div>
            <p className="text-sm sm:text-base font-black font-mono tracking-wide bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm line-clamp-1">
              {time}
            </p>
          </div>
        </div>
      </div>
      
      {/* Warning Indicator Badge - COMPACT */}
      {isInactive && (
        <div className="absolute top-2.5 right-2.5 z-20 animate-pulse">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500/90 to-red-500/90 border-2 border-orange-400/50 shadow-lg backdrop-blur-sm">
            <AlertCircle className="w-3.5 h-3.5 text-white animate-bounce" />
            <span className="text-xs font-black text-white">⚠️ {timeUntilLogout}s</span>
          </div>
        </div>
      )}
      
      {/* Bottom glow effect */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-500 blur-sm ${
        isInactive 
          ? 'bg-gradient-to-r from-transparent via-red-500/80 to-transparent opacity-100' 
          : 'bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100'
      }`} />
      
      {/* CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2 {
          animation-delay: 2s;
        }
        .animation-delay-3 {
          animation-delay: 3s;
        }
        .animation-delay-4 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
