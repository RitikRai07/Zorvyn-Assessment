'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ChevronDown, Lightbulb, Shield, Zap } from 'lucide-react'

const tips = [
  {
    icon: Shield,
    title: 'Role Switching',
    description: 'Switch between Admin and Viewer roles using the dropdown in the header to see different UI features.',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Zap,
    title: 'Financial Insights',
    description: 'Use the AI Chat to get personalized financial advice. Ask about income, expenses, savings, or budget recommendations.',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Lightbulb,
    title: 'Dashboard Tips',
    description: 'Explore the Insights tab for deep spending analysis, trends, and actionable recommendations to improve your finances.',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
]

export function TipSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {tips.map((tip, index) => {
        const Icon = tip.icon
        const isExpanded = expandedIndex === index

        return (
          <Card
            key={index}
            className="group relative border-2 border-border/50 hover:border-primary/40 transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-lg"
            onClick={() => setExpandedIndex(isExpanded ? null : index)}
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 p-4 sm:p-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className={`${tip.bgColor} rounded-xl p-2.5 transition-all duration-300 group-hover:scale-110`}>
                  <Icon className={`w-5 h-5 ${tip.color}`} />
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* Title */}
              <h3 className="font-bold text-base text-foreground mb-1 group-hover:text-primary transition-colors">
                {tip.title}
              </h3>

              {/* Description - Show preview or full */}
              <p
                className={`text-sm text-muted-foreground leading-relaxed overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'max-h-96' : 'line-clamp-2'
                }`}
              >
                {tip.description}
              </p>

              {/* Expand indicator */}
              <p className="text-xs text-primary/60 mt-2 font-medium">
                {isExpanded ? '▼ Click to collapse' : '▶ Click to expand'}
              </p>
            </div>

            {/* Bottom accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${tip.color.replace('text-', 'from-').replace('dark:', '')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </Card>
        )
      })}
    </div>
  )
}
