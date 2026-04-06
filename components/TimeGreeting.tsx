'use client'

import { useEffect, useState } from 'react'
import { useFinance } from '@/lib/hooks/useFinance'
import { Card } from '@/components/ui/card'
import { Sun, Moon, Cloud, Clock, Activity } from 'lucide-react'

interface TimeInfo {
  hour: number
  greeting: string
  emoji: string
  icon: typeof Sun
  bgColor: string
}

function getTimeGreeting(): TimeInfo {
  const now = new Date()
  const hour = now.getHours()

  if (hour >= 5 && hour < 12) {
    return {
      hour,
      greeting: 'Good Morning',
      emoji: '🌅',
      icon: Sun,
      bgColor: 'from-yellow-400 to-orange-500',
    }
  } else if (hour >= 12 && hour < 17) {
    return {
      hour,
      greeting: 'Good Afternoon',
      emoji: '☀️',
      icon: Sun,
      bgColor: 'from-orange-400 to-yellow-500',
    }
  } else if (hour >= 17 && hour < 21) {
    return {
      hour,
      greeting: 'Good Evening',
      emoji: '🌆',
      icon: Cloud,
      bgColor: 'from-purple-400 to-pink-500',
    }
  } else {
    return {
      hour,
      greeting: 'Good Night',
      emoji: '🌙',
      icon: Moon,
      bgColor: 'from-indigo-600 to-purple-700',
    }
  }
}

export function TimeGreeting() {
  const { role, userProfile } = useFinance()
  const [timeInfo, setTimeInfo] = useState<TimeInfo | null>(null)
  const [currentTime, setCurrentTime] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')
  const [sessionTime, setSessionTime] = useState<string>('0m')
  const [sessionStartTime] = useState<Date>(new Date())

  useEffect(() => {
    setTimeInfo(getTimeGreeting())

    const timer = setInterval(() => {
      setTimeInfo(getTimeGreeting())
      
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      )

      setCurrentDate(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        })
      )

      // Calculate session duration
      const diff = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000)
      const hours = Math.floor(diff / 3600)
      const minutes = Math.floor((diff % 3600) / 60)

      if (hours > 0) {
        setSessionTime(`${hours}h ${minutes}m`)
      } else {
        setSessionTime(`${minutes}m`)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [sessionStartTime])

  if (!timeInfo) return null

  const Icon = timeInfo.icon
  const UserName = role === 'admin' ? 'Harshita' : 'Viewer'
  const UserEmoji = role === 'admin' ? '👑' : '👁️'

  return (
    <Card className={`bg-linear-to-r ${timeInfo.bgColor} border-0 text-white overflow-hidden shadow-lg hover:shadow-xl transition-all animate-fadeIn`}>
      <div className="p-6 sm:p-8 space-y-5">
        {/* Header with emoji and greeting */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="text-5xl sm:text-6xl drop-shadow-lg">{timeInfo.emoji}</div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold drop-shadow-md">{timeInfo.greeting}</h2>
              <p className="text-sm sm:text-base opacity-90 font-medium">
                {UserEmoji} {UserName}
              </p>
            </div>
          </div>
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 opacity-50 flex-shrink-0" />
        </div>

        {/* Time and Date Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t-2 border-white/30">
          {/* Time */}
          <div className="space-y-1.5 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs sm:text-sm opacity-90 font-semibold">
              <Clock className="w-4 h-4" />
              Time (HH:MM:SS)
            </div>
            <p className="text-lg sm:text-2xl font-mono font-bold tracking-wider">{currentTime}</p>
          </div>

          {/* Date */}
          <div className="space-y-1.5 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs sm:text-sm opacity-90 font-semibold">
              📅 Date
            </div>
            <p className="text-lg sm:text-2xl font-mono font-bold">{currentDate}</p>
          </div>
        </div>

        {/* Activity and Extended Date Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs opacity-90 font-semibold">
              <Activity className="w-4 h-4" />
              Session Active
            </div>
            <p className="text-lg font-mono font-bold">{sessionTime}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs opacity-90 font-semibold">
              📍 Full Date
            </div>
            <p className="text-sm opacity-95 font-medium">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
