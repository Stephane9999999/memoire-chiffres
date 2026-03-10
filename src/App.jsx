import { useGame, GAME_STATES } from './hooks/useGame'
import Menu from './components/Menu'
import NumberDisplay from './components/NumberDisplay'
import InputPhase from './components/InputPhase'
import Result from './components/Result'

export default function App() {
  const {
    gameState,
    level,
    sequence,
    lastAnswerCorrect,
    bestLevel,
    streak,
    startFromMenu,
    onShowFinished,
    submitAnswer,
    nextRound,
    backToMenu,
  } = useGame()

  return (
    <div className="app">
      {gameState === GAME_STATES.MENU && (
        <Menu onStart={startFromMenu} />
      )}
      {gameState === GAME_STATES.SHOW && (
        <NumberDisplay
          key={sequence.join('-')}
          sequence={sequence}
          level={level}
          onFinished={onShowFinished}
        />
      )}
      {gameState === GAME_STATES.INPUT && (
        <InputPhase
          sequence={sequence}
          level={level}
          onSubmit={submitAnswer}
        />
      )}
      {gameState === GAME_STATES.RESULT && (
        <Result
          correct={lastAnswerCorrect}
          sequence={sequence}
          bestLevel={bestLevel}
          streak={streak}
          onNext={nextRound}
          onMenu={backToMenu}
        />
      )}
    </div>
  )
}
