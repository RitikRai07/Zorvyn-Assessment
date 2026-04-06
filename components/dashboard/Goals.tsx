'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus, Target, TrendingUp, CheckCircle2, Circle } from 'lucide-react'
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

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem('zorvyn_goals')
    if (saved) {
      const parsed = JSON.parse(saved)
      return parsed.map((g: any) => ({
        ...g,
        deadline: new Date(g.deadline)
      }))
    }
    return [
      {
        id: '1',
        name: 'Emergency Fund',
        targetAmount: 100000,
        currentAmount: 45000,
        category: 'Savings',
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 12)),
        completed: false,
        priority: 'high'
      },
      {
        id: '2',
        name: 'Vacation Fund',
        targetAmount: 50000,
        currentAmount: 25000,
        category: 'Travel',
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        completed: false,
        priority: 'medium'
      },
      {
        id: '3',
        name: 'New Laptop',
        targetAmount: 80000,
        currentAmount: 80000,
        category: 'Shopping',
        deadline: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        completed: true,
        priority: 'low'
      }
    ]
  })

  const [goalName, setGoalName] = useState('')
  const [goalAmount, setGoalAmount] = useState('')
  const [goalCategory, setGoalCategory] = useState('Savings')

  useEffect(() => {
    localStorage.setItem('zorvyn_goals', JSON.stringify(goals))
  }, [goals])

  const addGoal = () => {
    if (!goalName || !goalAmount) return

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: goalName,
      targetAmount: parseFloat(goalAmount),
      currentAmount: 0,
      category: goalCategory,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      completed: false,
      priority: 'medium'
    }

    setGoals([...goals, newGoal])
    setGoalName('')
    setGoalAmount('')
    setGoalCategory('Savings')
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => 
      g.id === id ? { ...g, completed: !g.completed, currentAmount: !g.completed ? g.targetAmount : g.currentAmount } : g
    ))
  }

  const completedGoals = goals.filter(g => g.completed).length
  const totalGoalsAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalSavedAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const averageProgress = goals.length > 0 ? Math.round((totalSavedAmount / totalGoalsAmount) * 100) : 0

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'medium': return 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'low': return 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
      default: return ''
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold flex items-center gap-2">
            <Target className="w-8 h-8 text-primary" />
            Financial Goals
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Track and manage your savings targets</p>
        </div>
      </div>

      {/* Summary Cards - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-purple-50/80 dark:from-purple-950/30 to-purple-100/40 dark:to-purple-900/20 shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-black">Active Goals</p>
                <span className="text-2xl">🎯</span>
              </div>
              <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                {goals.filter(g => !g.completed).length}
              </p>
              <p className="text-xs text-muted-foreground font-semibold border-t border-purple-200/50 dark:border-purple-800/50 pt-2">
                of {goals.length} total
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-50/80 dark:from-blue-950/30 to-blue-100/40 dark:to-blue-900/20 shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-black">Completed</p>
                <span className="text-2xl">{completedGoals > 0 ? '✅' : '🔄'}</span>
              </div>
              <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                {completedGoals}
              </p>
              <p className="text-xs text-muted-foreground font-semibold border-t border-blue-200/50 dark:border-blue-800/50 pt-2">
                {completedGoals > 0 ? '🎉 Great progress!' : 'None yet'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-green-50/80 dark:from-green-950/30 to-green-100/40 dark:to-green-900/20 shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-black">Total Saved</p>
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-4xl font-black bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                {formatCurrency(totalSavedAmount)}
              </p>
              <p className="text-xs text-muted-foreground font-semibold border-t border-green-200/50 dark:border-green-800/50 pt-2">
                of {formatCurrency(totalGoalsAmount)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200/50 dark:border-orange-800/50 bg-gradient-to-br from-orange-50/80 dark:from-orange-950/30 to-orange-100/40 dark:to-orange-900/20 shadow-lg hover:shadow-xl transition-all hover:scale-105">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-black">Progress</p>
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-4xl font-black bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                {averageProgress}%
              </p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden border border-orange-200/50 dark:border-orange-800/50">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500"
                  style={{ width: `${averageProgress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Goals Section */}
      <Card className="border-2 border-primary/30">
        <CardHeader className="bg-linear-to-r from-primary/10 to-secondary/5 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Input
              placeholder="Goal name (e.g., New Car)"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="border-2"
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            />
            <Input
              placeholder="Target amount"
              type="number"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              className="border-2"
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            />
            <select
              value={goalCategory}
              onChange={(e) => setGoalCategory(e.target.value)}
              className="rounded-md border-2 border-input bg-background px-3 py-2 text-sm"
            >
              <option>Savings</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Home</option>
              <option>Education</option>
              <option>Other</option>
            </select>
            <Button
              onClick={addGoal}
              className="bg-linear-to-r from-primary to-secondary hover:opacity-90"
              disabled={!goalName || !goalAmount}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <Card className="border-2 border-primary/30">
        <CardHeader className="bg-linear-to-r from-primary/10 to-secondary/5 pb-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {goals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-lg font-bold text-foreground">No Goals Yet</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first goal to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {goals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100
                const daysLeft = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                const isOverdue = daysLeft < 0 && !goal.completed

                return (
                  <div
                    key={goal.id}
                    className={`group hover:bg-accent/30 transition-colors px-4 sm:px-6 py-5 ${goal.completed ? 'opacity-75 bg-accent/20' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <button
                          onClick={() => toggleGoal(goal.id)}
                          className="mt-1 flex-shrink-0 transition-transform hover:scale-110"
                        >
                          {goal.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className={`text-lg font-bold ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {goal.name}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getPriorityColor(goal.priority)}`}>
                              {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                            </span>
                            <span className="bg-secondary/20 text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-semibold">
                              📁 {goal.category}
                            </span>
                            {isOverdue && (
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-full text-xs font-bold">
                                ⏰ Overdue
                              </span>
                            )}
                          </div>

                          {/* Premium Progress Bar */}
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-black text-foreground">
                                {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-primary/30 to-secondary/20 text-primary-foreground">
                                {Math.round(progress)}% Complete
                              </span>
                            </div>
                            
                            {/* Enhanced Progress Bar with Gradient */}
                            <div className="relative w-full h-4 bg-muted rounded-full overflow-hidden shadow-inner">
                              {/* Shimmer effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 blur-sm" />
                              
                              {/* Main progress bar */}
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 transition-all duration-500 rounded-full shadow-lg relative overflow-hidden"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              >
                                {/* Animated shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
                              </div>
                              
                              {/* Background gradient for remaining */}
                              <div className="absolute top-0 right-0 bottom-0 left-[${Math.min(progress, 100)}%] bg-gradient-to-r from-muted/50 to-muted/30" />
                            </div>
                            
                            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                              <span className={`${daysLeft < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                {daysLeft > 0 ? `⏱️ ${daysLeft} days left` : daysLeft === 0 ? '🎯 Due today' : `⚠️ ${Math.abs(daysLeft)} days overdue`}
                              </span>
                              <span className="text-muted-foreground">
                                📅 {goal.deadline.toLocaleDateString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteGoal(goal.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
