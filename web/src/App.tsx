import { useEffect, useRef, useState } from 'react'
import './App.css'

const ROUND_DURATION = 18 // seconds
const HALF_TIME = 9 // seconds
const FINAL_COUNTDOWN_START = 5 // seconds before end

export default function App() {
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [totalElapsed, setTotalElapsed] = useState(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize AudioContext
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }, [])

  // Play a beep sound
  const playBeep = (duration: number = 100, frequency: number = 800) => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = frequency
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration / 1000)
  }

  // Timer loop
  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1

        // Round starts (18 seconds) - 2 short beeps
        if (newTime === ROUND_DURATION) {
          playBeep(80, 1000)
          setTimeout(() => playBeep(80, 1000), 150)
        }

        // Half time beep (9 seconds)
        if (newTime === HALF_TIME) {
          playBeep(150, 800)
        }

        // Final countdown (5, 4, 3, 2, 1 seconds) - 1 beep per second
        if (newTime > 0 && newTime <= FINAL_COUNTDOWN_START) {
          playBeep(100, 600)
        }

        // End of round - 2 short beeps
        if (newTime === 0) {
          playBeep(80, 1000)
          setTimeout(() => playBeep(80, 1000), 150)

          // Restart the loop
          return ROUND_DURATION
        }

        return newTime
      })

      setTotalElapsed(prev => prev + 1)
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const handleStart = () => {
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleRestart = () => {
    setTimeLeft(ROUND_DURATION)
    setTotalElapsed(0)
    setIsRunning(true)
  }

  const minutes = Math.floor(totalElapsed / 60)
  const seconds = totalElapsed % 60

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>CCAT Timer</h1>
          <div className="total-time">
            {minutes}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        {/* Main Timer Display */}
        <div className="timer-display">
          <div className="time">{String(timeLeft).padStart(2, '0')}</div>
          <div className="unit">sec</div>
        </div>

        {/* Large RE Button (Center) */}
        <button
          className={`restart-button ${isRunning ? 'running' : ''}`}
          onClick={handleRestart}
        >
          RE
        </button>

        {/* Control Buttons */}
        <div className="controls">
          <button
            className="control-button start-button"
            onClick={handleStart}
            disabled={isRunning}
          >
            START
          </button>

          <button
            className="control-button stop-button"
            onClick={handleStop}
            disabled={!isRunning}
          >
            STOP
          </button>
        </div>

        {/* Status */}
        <div className="status">
          {isRunning ? '⏱️ Running' : '⏸️ Stopped'}
        </div>
      </div>
    </div>
  )
}
