import { useEffect, useRef, useState } from 'react'

export default function NumberDisplay({ sequence, level, onFinished }) {
  const duration = level + 1
  const [timeLeft, setTimeLeft] = useState(duration)
  const onFinishedRef = useRef(onFinished)
  onFinishedRef.current = onFinished

  useEffect(() => {
    setTimeLeft(duration)
    let remaining = duration
    const interval = setInterval(() => {
      remaining -= 1
      setTimeLeft(remaining)
      if (remaining <= 0) {
        clearInterval(interval)
        onFinishedRef.current()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [sequence, duration])

  const progress = (timeLeft / duration) * 100

  return (
    <div className="screen show-screen">
      <div className="level-badge">Niveau {level}</div>

      <p className="instruction">Mémorisez cette séquence</p>

      <div className="sequence-display">
        {sequence.map((digit, i) => (
          <span key={i} className="digit">{digit}</span>
        ))}
      </div>

      <div className="countdown">
        <div className="countdown-bar-bg">
          <div
            className="countdown-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="countdown-text">{timeLeft}s</div>
      </div>
    </div>
  )
}
