'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface ExpandableSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  className?: string
  headerClassName?: string
}

export function ExpandableSection({
  title,
  children,
  defaultExpanded = false,
  className = '',
  headerClassName = '',
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <Card className={`border-2 border-border/50 hover:border-primary/40 transition-all duration-300 group overflow-hidden ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between gap-3 px-5 sm:px-6 py-4 sm:py-5 hover:bg-muted/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${headerClassName}`}
      >
        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors text-left">
          {title}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Content area with smooth animation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-t border-border/30">
          {children}
        </div>
      </div>
    </Card>
  )
}
