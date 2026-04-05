'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin } from 'lucide-react'

export function TimeDisplay() {
  const [dateTime, setDateTime] = useState<string>('')
  const [time, setTime] = useState<string>('')
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
    <div className="relative group overflow-hidden rounded-xl">
      {/* Enhanced gradient background with animations */}
      <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-secondary/5 to-primary/5 opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-linear-to-r from-sky-600/10 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-linear-to-r from-primary/40 to-secondary/40 bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Static border */}
      <div className="absolute inset-0 rounded-xl border-2 border-primary/20 group-hover:border-primary/0 transition-colors duration-300" />
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 animate-shimmer rounded-xl" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8 px-5 sm:px-7 py-5 sm:py-6">
        {/* Date Section */}
        <div className="flex items-center gap-4 flex-1 group/date">
          <div className="relative p-3 bg-linear-to-br from-blue-600/20 to-cyan-600/10 rounded-xl shadow-lg ring-2 ring-blue-600/20 group-hover/date:ring-blue-600/40 group-hover/date:from-blue-600/30 transition-all duration-300">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover/date:scale-125 transition-transform duration-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">📅 Date</label>
            </div>
            <p className="text-base sm:text-lg font-bold bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {dateTime}
            </p>
          </div>
        </div>
        
        {/* Divider with enhanced style */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="h-12 w-px bg-linear-to-b from-primary/30 via-primary/15 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="h-1 w-1 rounded-full bg-primary/40 ring-1 ring-primary/50" />
          <div className="h-12 w-px bg-linear-to-t from-primary/30 via-primary/15 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Time Section */}
        <div className="flex items-center gap-4 flex-1 group/time">
          <div className="relative p-3 bg-linear-to-br from-purple-600/20 to-violet-600/10 rounded-xl shadow-lg ring-2 ring-purple-600/20 group-hover/time:ring-purple-600/40 group-hover/time:from-purple-600/30 transition-all duration-300">
            <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover/time:scale-125 transition-transform duration-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">🕐 Time (IST)</label>
              <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400 opacity-70" />
            </div>
            <p className="text-base sm:text-lg font-bold font-mono tracking-wide bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {time}
            </p>
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  )
}
