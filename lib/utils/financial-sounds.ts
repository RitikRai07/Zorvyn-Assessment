// Enhanced financial event sounds using Web Audio API
export type FinancialEventType = 'buy' | 'sell' | 'profit' | 'loss' | 'transaction' | 'success' | 'warning'

/**
 * Create and play a financial event sound
 * Different sounds for different financial events
 */
export function playFinancialSound(eventType: FinancialEventType) {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const now = audioContext.currentTime

    switch (eventType) {
      case 'buy':
        playBuySound(audioContext, now)
        break
      case 'sell':
        playSellSound(audioContext, now)
        break
      case 'profit':
        playProfitSound(audioContext, now)
        break
      case 'loss':
        playLossSound(audioContext, now)
        break
      case 'transaction':
        playTransactionSound(audioContext, now)
        break
      case 'success':
        playSuccessSound(audioContext, now)
        break
      case 'warning':
        playWarningSound(audioContext, now)
        break
    }
  } catch (error) {
    console.log('Audio not available:', error)
  }
}

/**
 * BUY SOUND: Ascending tones indicating a purchase/investment
 * Three ascending notes (buying confidence)
 */
function playBuySound(audioContext: AudioContext, now: number) {
  const notes = [
    { freq: 440, time: 0, duration: 0.15 },      // A4 - starting note
    { freq: 554, time: 0.18, duration: 0.15 },   // C#5 - middle note
    { freq: 659, time: 0.36, duration: 0.2 },    // E5 - high note (confidence)
  ]

  notes.forEach(note => {
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()
    
    osc.connect(gain)
    gain.connect(audioContext.destination)
    
    osc.frequency.value = note.freq
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(0.3, now + note.time)
    gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.duration)
    
    osc.start(now + note.time)
    osc.stop(now + note.time + note.duration)
  })
}

/**
 * SELL SOUND: Descending tones indicating a sale/withdrawal
 * Descending pattern (selling confidence)
 */
function playSellSound(audioContext: AudioContext, now: number) {
  const notes = [
    { freq: 659, time: 0, duration: 0.15 },      // E5 - high start
    { freq: 554, time: 0.18, duration: 0.15 },   // C#5 - middle
    { freq: 440, time: 0.36, duration: 0.2 },    // A4 - lower (completion)
  ]

  notes.forEach(note => {
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()
    
    osc.connect(gain)
    gain.connect(audioContext.destination)
    
    osc.frequency.value = note.freq
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(0.3, now + note.time)
    gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.duration)
    
    osc.start(now + note.time)
    osc.stop(now + note.time + note.duration)
  })
}

/**
 * PROFIT SOUND: Happy, uplifting sound
 * Major chord arpeggio (profit celebration)
 */
function playProfitSound(audioContext: AudioContext, now: number) {
  const notes = [
    { freq: 262, time: 0, duration: 0.1 },       // C4
    { freq: 330, time: 0.12, duration: 0.1 },    // E4
    { freq: 392, time: 0.24, duration: 0.1 },    // G4
    { freq: 524, time: 0.36, duration: 0.3 },    // C5 (hold)
  ]

  notes.forEach(note => {
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()
    
    osc.connect(gain)
    gain.connect(audioContext.destination)
    
    osc.frequency.value = note.freq
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(0.35, now + note.time)
    gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.duration)
    
    osc.start(now + note.time)
    osc.stop(now + note.time + note.duration)
  })
}

/**
 * LOSS SOUND: Sad, descending sound
 * Minor chord (loss alert)
 */
function playLossSound(audioContext: AudioContext, now: number) {
  const notes = [
    { freq: 349, time: 0, duration: 0.12 },      // F4
    { freq: 294, time: 0.15, duration: 0.12 },   // D4
    { freq: 247, time: 0.3, duration: 0.25 },    // B3 (low, sad)
  ]

  notes.forEach(note => {
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()
    
    osc.connect(gain)
    gain.connect(audioContext.destination)
    
    osc.frequency.value = note.freq
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(0.25, now + note.time)
    gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.duration)
    
    osc.start(now + note.time)
    osc.stop(now + note.time + note.duration)
  })
}

/**
 * TRANSACTION SOUND: Neutral, professional sound
 * Clean, simple beep
 */
function playTransactionSound(audioContext: AudioContext, now: number) {
  const osc = audioContext.createOscillator()
  const gain = audioContext.createGain()
  
  osc.connect(gain)
  gain.connect(audioContext.destination)
  
  osc.frequency.value = 600
  osc.type = 'sine'
  
  gain.gain.setValueAtTime(0.2, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
  
  osc.start(now)
  osc.stop(now + 0.15)
}

/**
 * SUCCESS SOUND: Uplifting confirmation
 * Used for successful operations
 */
function playSuccessSound(audioContext: AudioContext, now: number) {
  const notes = [
    { freq: 800, time: 0, duration: 0.1 },
    { freq: 1000, time: 0.12, duration: 0.15 },
  ]

  notes.forEach(note => {
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()
    
    osc.connect(gain)
    gain.connect(audioContext.destination)
    
    osc.frequency.value = note.freq
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(0.3, now + note.time)
    gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.duration)
    
    osc.start(now + note.time)
    osc.stop(now + note.time + note.duration)
  })
}

/**
 * WARNING SOUND: Alert/attention getter
 * Used for important alerts
 */
function playWarningSound(audioContext: AudioContext, now: number) {
  const notes = [
    { freq: 800, time: 0, duration: 0.1 },
    { freq: 600, time: 0.12, duration: 0.1 },
    { freq: 800, time: 0.24, duration: 0.15 },
  ]

  notes.forEach(note => {
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()
    
    osc.connect(gain)
    gain.connect(audioContext.destination)
    
    osc.frequency.value = note.freq
    osc.type = 'sine'
    
    gain.gain.setValueAtTime(0.25, now + note.time)
    gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.duration)
    
    osc.start(now + note.time)
    osc.stop(now + note.time + note.duration)
  })
}
