export default function Result({ correct, sequence, bestLevel, streak, onNext, onMenu }) {
  return (
    <div className="screen result-screen">
      <div className={`result-icon ${correct ? 'correct' : 'wrong'}`}>
        {correct ? '🎉' : '❌'}
      </div>

      <h2 className={correct ? 'text-correct' : 'text-wrong'}>
        {correct ? 'Bravo !' : 'Raté !'}
      </h2>

      <p className="result-sequence-label">La séquence était :</p>
      <div className="sequence-display result-sequence">
        {sequence.map((digit, i) => (
          <span key={i} className="digit">{digit}</span>
        ))}
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat-value">{bestLevel}</span>
          <span className="stat-label">Niveau max</span>
        </div>
        <div className="stat">
          <span className="stat-value">{streak}</span>
          <span className="stat-label">Série en cours</span>
        </div>
      </div>

      <div className="result-actions">
        <button className="btn btn-primary" onClick={onNext}>
          {correct ? 'Niveau suivant →' : 'Réessayer'}
        </button>
        <button className="btn btn-secondary" onClick={onMenu}>
          Menu
        </button>
      </div>
    </div>
  )
}
