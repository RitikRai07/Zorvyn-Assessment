// Sound notification utility for transaction events
export function playNotificationSound(type: 'success' | 'error' | 'info' = 'success') {
  try {
    // Using Web Audio API to create notification sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const now = audioContext.currentTime

    const frequencies: Record<string, number> = {
      success: 800,  // High pitch for success (like a coin drop)
      error: 300,    // Low pitch for error
      info: 600,     // Medium pitch for info
    }

    const frequency = frequencies[type]
    const duration = type === 'success' ? 0.3 : 0.2

    // Create oscillator
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'

    // Envelope
    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration)

    oscillator.start(now)
    oscillator.stop(now + duration)
  } catch (error) {
    // Fallback if Web Audio API is not available
    console.log('Notification sound not available')
  }
}

// Play success sound (for adding/updating transactions)
export function playSuccessSound() {
  playNotificationSound('success')
}

// Play error sound
export function playErrorSound() {
  playNotificationSound('error')
}

// Play info sound
export function playInfoSound() {
  playNotificationSound('info')
}

// Play multiple beeps (for important notifications)
export function playBeeps(count: number = 2, frequency: number = 800, duration: number = 0.15) {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const gap = 100 // milliseconds between beeps

    for (let i = 0; i < count; i++) {
      const now = audioContext.currentTime + (i * (duration + gap / 1000))
      
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.25, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration)

      oscillator.start(now)
      oscillator.stop(now + duration)
    }
  } catch (error) {
    console.log('Beep sound not available')
  }
}

// Enhanced coin drop sound (for money received)
export function playMoneyReceivedSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const now = audioContext.currentTime

    // Create a more sophisticated "money received" effect
    // Three high notes in succession (like coins dropping)
    const notes = [
      { freq: 932, time: 0, duration: 0.12 },      // A5
      { freq: 1047, time: 0.15, duration: 0.1 },   // C6
      { freq: 1175, time: 0.28, duration: 0.15 },  // D6
    ]

    notes.forEach(note => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = note.freq
      oscillator.type = 'sine'

      // Quick attack, smooth decay
      gainNode.gain.setValueAtTime(0, now + note.time)
      gainNode.gain.linearRampToValueAtTime(0.35, now + note.time + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.duration)

      oscillator.start(now + note.time)
      oscillator.stop(now + note.time + note.duration)
    })
  } catch (error) {
    console.log('Money sound not available')
  }
}

// Enhanced expense/deduction sound (warning beep)
export function playExpenseWarningSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const now = audioContext.currentTime

    // Two descending tones for expense
    const notes = [
      { freq: 400, time: 0, duration: 0.1 },
      { freq: 320, time: 0.12, duration: 0.1 },
    ]

    notes.forEach(note => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = note.freq
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.2, now + note.time)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.duration)

      oscillator.start(now + note.time)
      oscillator.stop(now + note.time + note.duration)
    })
  } catch (error) {
    console.log('Expense sound not available')
  }
}

// Notify user of transaction add/update with different sounds based on type
export function notifyTransactionAdded(type: 'income' | 'expense') {
  if (type === 'income') {
    // Money received sound for income
    playMoneyReceivedSound()
    if (typeof window !== 'undefined') {
      console.log('✓ Income added successfully')
    }
  } else {
    // Expense warning sound for expenses
    playExpenseWarningSound()
    if (typeof window !== 'undefined') {
      console.log('✓ Expense added successfully')
    }
  }
}

