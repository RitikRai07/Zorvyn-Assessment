'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Transaction } from '@/lib/types'
import { generateSmartInsights } from '@/lib/utils/calculations'
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle, Zap } from 'lucide-react'

interface SmartInsightsProps {
  transactions: Transaction[]
}

export function SmartInsights({ transactions }: SmartInsightsProps) {
  const insights = generateSmartInsights(transactions)

  const getIconAndColor = (insight: string) => {
    if (insight.includes('increased')) {
      return {
        icon: <AlertCircle className="w-5 h-5" />,
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
        dotColor: 'bg-orange-500',
        textColor: 'text-orange-600 dark:text-orange-400'
      }
    }
    if (insight.includes('reduced') || insight.includes('Excellent')) {
      return {
        icon: <CheckCircle className="w-5 h-5" />,
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        dotColor: 'bg-green-500',
        textColor: 'text-green-600 dark:text-green-400'
      }
    }
    if (insight.includes('highest')) {
      return {
        icon: <TrendingUp className="w-5 h-5" />,
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        dotColor: 'bg-blue-500',
        textColor: 'text-blue-600 dark:text-blue-400'
      }
    }
    return {
      icon: <Lightbulb className="w-5 h-5" />,
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      dotColor: 'bg-amber-500',
      textColor: 'text-amber-600 dark:text-amber-400'
    }
  }

  return (
    <Card className="animate-fadeIn group relative border-border/50 overflow-hidden">
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            Smart Insights
          </CardTitle>
          <Zap className="w-4 h-4 text-purple-500 animate-pulse" />
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        {insights.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-lg bg-muted/30 border border-dashed border-border">
            <Lightbulb className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">Add more transactions to get personalized insights</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {insights.map((insight, index) => {
              const { icon, bgColor, borderColor, dotColor, textColor } = getIconAndColor(insight)
              
              return (
                <div
                  key={index}
                  className={`flex gap-3 p-3.5 rounded-lg border transition-all duration-300 group/insight cursor-pointer
                    ${bgColor} ${borderColor} 
                    hover:shadow-md hover:scale-[1.02] hover:border-opacity-50`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Animated dot indicator */}
                  <div className={`shrink-0 mt-0.5 rounded-full w-6 h-6 flex items-center justify-center ${dotColor} bg-opacity-20 group-hover/insight:scale-125 transition-transform duration-300`}>
                    <div className={`${textColor}`}>
                      {icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-relaxed group-hover/insight:text-primary/80 transition-colors">
                      {insight}
                    </p>
                  </div>

                  {/* Accent bar */}
                  <div className={`w-1 rounded-full ${dotColor} opacity-0 group-hover/insight:opacity-100 transition-opacity duration-300`} />
                </div>
              )
            })}
          </div>
        )}
      </CardContent>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        div:has(> div:nth-child(3)) > div > div {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </Card>
  )
}
