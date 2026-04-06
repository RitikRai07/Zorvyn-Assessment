import { useEffect, useRef, useCallback, useState } from 'react'

interface SessionConfig {
  inactivityWarningTime: number // milliseconds
  autoLogoutTime: number // milliseconds
  onInactivityWarning: () => void
  onAutoLogout: () => void
}

export function useSessionActivity(config: SessionConfig) {
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const warningShownRef = useRef(false)
  const [isInactive, setIsInactive] = useState(false)

  const resetInactivityTimer = useCallback(() => {
    // Clear existing timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    warningShownRef.current = false
    setIsInactive(false)

    // Set warning timer
    inactivityTimerRef.current = setTimeout(() => {
      if (!warningShownRef.current) {
        warningShownRef.current = true
        setIsInactive(true)
        config.onInactivityWarning()

        // Set auto-logout timer
        const logoutTimer = setTimeout(() => {
          config.onAutoLogout()
        }, config.autoLogoutTime - config.inactivityWarningTime)

        return () => clearTimeout(logoutTimer)
      }
    }, config.inactivityWarningTime)
  }, [config])

  const handleUserActivity = useCallback(() => {
    resetInactivityTimer()
  }, [resetInactivityTimer])

  useEffect(() => {
    // Listen for mouse movement
    window.addEventListener('mousemove', handleUserActivity)
    window.addEventListener('mousedown', handleUserActivity)
    window.addEventListener('keypress', handleUserActivity)
    window.addEventListener('touchstart', handleUserActivity)
    window.addEventListener('scroll', handleUserActivity)

    // Initialize timer
    resetInactivityTimer()

    return () => {
      window.removeEventListener('mousemove', handleUserActivity)
      window.removeEventListener('mousedown', handleUserActivity)
      window.removeEventListener('keypress', handleUserActivity)
      window.removeEventListener('touchstart', handleUserActivity)
      window.removeEventListener('scroll', handleUserActivity)

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [handleUserActivity, resetInactivityTimer])

  return { isInactive, resetInactivityTimer }
}
