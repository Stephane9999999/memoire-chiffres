export default function Menu({ onStart }) {
  return (
    <div className="screen menu-screen">
      <div className="logo">🔢</div>
      <h1>Mémoire Chiffres</h1>
      <p className="subtitle">
        Mémorisez la séquence de chiffres, puis retapez-la de mémoire.
        <br />
        Plus vous réussissez, plus la séquence s'allonge !
      </p>

      <div className="rules">
        <div className="rule">
          <span className="rule-icon">👁️</span>
          <span>Regardez la séquence s'afficher</span>
        </div>
        <div className="rule">
          <span className="rule-icon">🧠</span>
          <span>Mémorisez-la pendant le compte à rebours</span>
        </div>
        <div className="rule">
          <span className="rule-icon">⌨️</span>
          <span>Retapez-la de mémoire</span>
        </div>
      </div>

      <button className="btn btn-primary btn-large" onClick={onStart}>
        Commencer
      </button>
    </div>
  )
}
