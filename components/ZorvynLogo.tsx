'use client'

interface ZorvynLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function ZorvynLogo({ 
  size = 'md', 
  showText = false,
  className = ''
}: ZorvynLogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-sm' },
    md: { icon: 40, text: 'text-lg' },
    lg: { icon: 56, text: 'text-2xl' },
  }

  const sizeConfig = sizes[size]

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Zorvyn Logo - Curved Design */}
      <svg
        width={sizeConfig.icon}
        height={sizeConfig.icon}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md hover:drop-shadow-lg transition-all duration-300"
      >
        {/* Background Circle */}
        <circle
          cx="28"
          cy="28"
          r="28"
          fill="#E8F4F0"
          opacity="0.9"
        />

        {/* Top Curve - Teal */}
        <path
          d="M 12 24 Q 20 12 36 20 Q 44 24 48 28"
          stroke="#1B6B6B"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottom Curve - Darker Teal */}
        <path
          d="M 20 40 Q 28 44 40 36 Q 47 32 50 28"
          stroke="#0F444F"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Optional Accent Dot */}
        <circle cx="28" cy="28" r="2" fill="#1B6B6B" opacity="0.5" />
      </svg>

      {/* Text Brand */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight bg-linear-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent ${sizeConfig.text}`}>
            Zorvyn
          </span>
          <span className="text-xs text-muted-foreground leading-tight">
            Finance
          </span>
        </div>
      )}
    </div>
  )
}
