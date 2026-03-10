import { useEffect, useRef, useState } from 'react'

export default function InputPhase({ sequence, level, onSubmit }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleChange(e) {
    const val = e.target.value.replace(/\D/g, '')
    if (val.length <= sequence.length) {
      setValue(val)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (value.length === sequence.length) {
      onSubmit(value)
    }
  }

  const chars = Array.from({ length: sequence.length }, (_, i) => value[i] ?? '')

  return (
    <div className="screen input-screen">
      <div className="level-badge">Niveau {level}</div>

      <p className="instruction">Retapez la séquence de mémoire</p>

      <div className="sequence-input-display">
        {chars.map((ch, i) => (
          <span key={i} className={`digit-slot ${ch ? 'filled' : ''}`}>
            {ch}
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleChange}
          className="hidden-input"
          autoComplete="off"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={value.length !== sequence.length}
        >
          Valider
        </button>
      </form>

      <p className="hint">
        {value.length}/{sequence.length} chiffres
      </p>
    </div>
  )
}
