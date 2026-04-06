'use client'

import { useState, useEffect } from 'react'
import { Target, ChevronUp, ChevronDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatting'

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  category: string
  deadline: Date
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

export function FloatingGoalsPanel() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('zorvyn_goals')
    if (saved) {
      const parsed = JSON.parse(saved)
      setGoals(parsed.map((g: any) => ({
        ...g,
        deadline: new Date(g.deadline)
      })))
    }
  }, [])

  if (!mounted) return null

  const completedGoals = goals.filter(g => g.completed).length
  const totalGoalsAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalSavedAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const averageProgress = goals.length > 0 ? Math.round((totalSavedAmount / totalGoalsAmount) * 100) : 0

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full sm:max-w-xs">
      {/* Floating Goals Panel */}
      <div className={`
        border-2 border-gradient-to-r from-primary/50 to-secondary/50 
        bg-gradient-to-br from-white/95 to-white/90 
        dark:from-slate-950/95 dark:to-slate-900/85
        backdrop-blur-xl rounded-2xl shadow-2xl
        transition-all duration-300 ease-out
        ${isExpanded ? 'max-h-96' : 'max-h-20'}
        overflow-hidden
      `}>
        {/* Header - Always Visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/20 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 text-left">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">Goals</p>
              <p className="text-xs text-muted-foreground">{averageProgress}% complete</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-border/50 divide-y divide-border/50 max-h-80 overflow-y-auto">
            {/* Progress Bar */}
            <div className="px-4 py-3 space-y-2 bg-accent/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">Overall Progress</span>
                <span className="font-mono font-bold text-primary">{averageProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 transition-all duration-500 rounded-full"
                  style={{ width: `${averageProgress}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="px-4 py-3 grid grid-cols-3 gap-2 text-center">
              <div className="space-y-1">
                <p className="text-lg font-bold text-primary">{goals.filter(g => !g.completed).length}</p>
                <p className="text-xs text-muted-foreground font-semibold">Active</p>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-green-600">{completedGoals}</p>
                <p className="text-xs text-muted-foreground font-semibold">Done</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-orange-600">{goals.length}</p>
                <p className="text-xs text-muted-foreground font-semibold">Total</p>
              </div>
            </div>

            {/* Goals List - Compact */}
            <div className="px-4 py-3 space-y-2">
              {goals.slice(0, 3).map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100
                return (
                  <div key={goal.id} className="space-y-1.5 pb-2 last:pb-0 border-b border-border/30 last:border-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-foreground truncate">{goal.name}</p>
                      <span className="text-xs font-mono font-bold text-primary">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                )
              })}
              {goals.length > 3 && (
                <p className="text-xs text-muted-foreground font-semibold text-center pt-1">
                  +{goals.length - 3} more goals
                </p>
              )}
            </div>

            {/* Saved Amount */}
            <div className="px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground">Total Saved</p>
                <p className="text-sm font-bold text-primary">
                  {formatCurrency(totalSavedAmount)} / {formatCurrency(totalGoalsAmount)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
