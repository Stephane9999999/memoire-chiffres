import { useState, useCallback } from 'react'

export const GAME_STATES = {
  MENU: 'MENU',
  SHOW: 'SHOW',
  INPUT: 'INPUT',
  RESULT: 'RESULT',
}

const MIN_LEVEL = 3
const INITIAL_LEVEL = 3

function generateSequence(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10))
}

export function useGame() {
  const [gameState, setGameState] = useState(GAME_STATES.MENU)
  const [level, setLevel] = useState(INITIAL_LEVEL)
  const [sequence, setSequence] = useState([])
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null)
  const [consecutiveErrors, setConsecutiveErrors] = useState(0)
  const [bestLevel, setBestLevel] = useState(INITIAL_LEVEL)
  const [streak, setStreak] = useState(0)

  const startGame = useCallback(() => {
    const newSeq = generateSequence(level)
    setSequence(newSeq)
    setGameState(GAME_STATES.SHOW)
  }, [level])

  const startFromMenu = useCallback(() => {
    setLevel(INITIAL_LEVEL)
    setConsecutiveErrors(0)
    setStreak(0)
    setBestLevel(INITIAL_LEVEL)
    const newSeq = generateSequence(INITIAL_LEVEL)
    setSequence(newSeq)
    setGameState(GAME_STATES.SHOW)
  }, [])

  const onShowFinished = useCallback(() => {
    setGameState(GAME_STATES.INPUT)
  }, [])

  const submitAnswer = useCallback((answer) => {
    const correct = answer === sequence.join('')
    setLastAnswerCorrect(correct)

    if (correct) {
      const newLevel = level + 1
      setLevel(newLevel)
      setBestLevel(prev => Math.max(prev, newLevel))
      setStreak(prev => prev + 1)
      setConsecutiveErrors(0)
    } else {
      const newErrors = consecutiveErrors + 1
      setConsecutiveErrors(newErrors)
      setStreak(0)
      if (newErrors >= 2) {
        setLevel(MIN_LEVEL)
        setConsecutiveErrors(0)
      } else {
        setLevel(prev => Math.max(MIN_LEVEL, prev - 1))
      }
    }

    setGameState(GAME_STATES.RESULT)
  }, [sequence, level, consecutiveErrors])

  const nextRound = useCallback(() => {
    const newSeq = generateSequence(level)
    setSequence(newSeq)
    setGameState(GAME_STATES.SHOW)
  }, [level])

  const backToMenu = useCallback(() => {
    setGameState(GAME_STATES.MENU)
    setLevel(INITIAL_LEVEL)
    setConsecutiveErrors(0)
    setStreak(0)
    setLastAnswerCorrect(null)
  }, [])

  return {
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
  }
}
