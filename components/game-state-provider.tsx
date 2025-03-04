"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type GameState = {
  evidenceCount: number
  collectEvidence: () => void
  hasCompletedMaze: boolean
  setMazeCompleted: () => void
  hasConnectedDots: boolean
  setDotsConnected: () => void
  unlockedAchievements: string[]
  unlockAchievement: (achievement: string) => void
  hasUnlockedAchievement: (achievement: string) => boolean
}

const GameStateContext = createContext<GameState | undefined>(undefined)

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [evidenceCount, setEvidenceCount] = useState(0)
  const [hasCompletedMaze, setHasCompletedMaze] = useState(false)
  const [hasConnectedDots, setHasConnectedDots] = useState(false)
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("conspiracyCorgiGameState")
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        setEvidenceCount(parsedState.evidenceCount || 0)
        setHasCompletedMaze(parsedState.hasCompletedMaze || false)
        setHasConnectedDots(parsedState.hasConnectedDots || false)
        setUnlockedAchievements(parsedState.unlockedAchievements || [])
      } catch (error) {
        console.error("Failed to parse saved game state:", error)
      }
    }
  }, [])

  // Save state to localStorage when it changes
  useEffect(() => {
    const stateToSave = {
      evidenceCount,
      hasCompletedMaze,
      hasConnectedDots,
      unlockedAchievements,
    }
    localStorage.setItem("conspiracyCorgiGameState", JSON.stringify(stateToSave))
  }, [evidenceCount, hasCompletedMaze, hasConnectedDots, unlockedAchievements])

  const collectEvidence = () => {
    setEvidenceCount((prev) => prev + 1)
  }

  const setMazeCompleted = () => {
    setHasCompletedMaze(true)
    unlockAchievement("maze_master")
  }

  const setDotsConnected = () => {
    setHasConnectedDots(true)
    unlockAchievement("conspiracy_theorist")
  }

  const unlockAchievement = (achievement: string) => {
    if (!unlockedAchievements.includes(achievement)) {
      setUnlockedAchievements((prev) => [...prev, achievement])
    }
  }

  const hasUnlockedAchievement = (achievement: string) => {
    return unlockedAchievements.includes(achievement)
  }

  return (
    <GameStateContext.Provider
      value={{
        evidenceCount,
        collectEvidence,
        hasCompletedMaze,
        setMazeCompleted,
        hasConnectedDots,
        setDotsConnected,
        unlockedAchievements,
        unlockAchievement,
        hasUnlockedAchievement,
      }}
    >
      {children}
    </GameStateContext.Provider>
  )
}

export function useGameState() {
  const context = useContext(GameStateContext)
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider")
  }
  return context
}

