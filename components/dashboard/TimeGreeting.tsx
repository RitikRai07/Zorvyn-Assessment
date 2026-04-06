'use client'

import { useState, useEffect } from 'react'
import { useFinance } from '@/lib/hooks/useFinance'
import { Card } from '@/components/ui/card'
import { Sun, Cloud, Moon, Star } from 'lucide-react'

interface GreetingProps {
  userName?: string
}

export function TimeGreeting({ userName = 'User' }: GreetingProps) {
  const { role } = useFinance()
  const [greeting, setGreeting] = useState('')
  const [icon, setIcon] = useState<React.ReactNode>(null)
  const [time, setTime] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const updateGreeting = () => {
      const now = new Date()
      const hour = now.getHours()
      
      let greetingText = ''
      let greetingIcon = null
      
      if (hour >= 5 && hour < 12) {
        greetingText = 'Good Morning'
        greetingIcon = <Sun className="w-5 h-5 text-yellow-500" />
      } else if (hour >= 12 && hour < 17) {
        greetingText = 'Good Afternoon'
        greetingIcon = <Cloud className="w-5 h-5 text-blue-500" />
      } else if (hour >= 17 && hour < 21) {
        greetingText = 'Good Evening'
        greetingIcon = <Cloud className="w-5 h-5 text-orange-500" />
      } else {
        greetingText = 'Good Night'
        greetingIcon = <Moon className="w-5 h-5 text-purple-500" />
      }
      
      const timeFormatter = new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      })
      
      setGreeting(greetingText)
      setIcon(greetingIcon)
      setTime(timeFormatter.format(now))
    }

    updateGreeting()
    const interval = setInterval(updateGreeting, 1000)
    
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return null
  }

  const displayName = role === 'admin' ? '👑 Admin' : '👤 Viewer'

  return (
    <Card className="relative overflow-hidden border-2 border-primary/30 bg-linear-to-br from-primary/10 via-secondary/5 to-accent/5">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-20 -z-10" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/5 rounded-full blur-3xl opacity-20 -z-10" />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-background/80 backdrop-blur-sm rounded-xl ring-2 ring-primary/20">
              {icon}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {greeting}
              </h2>
              <p className="text-2xl sm:text-3xl font-black bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {displayName}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-1">
              IST
            </div>
            <div className="font-mono text-lg sm:text-2xl font-bold text-primary">
              {time}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-2 pt-3 border-t border-primary/10">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">
            {role === 'admin' ? 'All systems normal • Admin privileges active' : 'Viewing mode active • Limited permissions'}
          </span>
        </div>
      </div>
    </Card>
  )
}
