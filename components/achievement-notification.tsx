"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award } from "lucide-react"
import { useGameState } from "@/components/game-state-provider"

const achievements = {
  first_evidence: {
    title: "First Clue",
    description: "You found your first piece of evidence!",
  },
  conspiracy_theorist: {
    title: "Conspiracy Theorist",
    description: "You connected all the dots on the corkboard!",
  },
  maze_master: {
    title: "Maze Master",
    description: "You successfully navigated the conspiracy maze!",
  },
  meme_collector: {
    title: "Meme Collector",
    description: "You've viewed all the conspiracy memes!",
  },
  video_watcher: {
    title: "Video Watcher",
    description: "You've watched all the conspiracy videos!",
  },
}

export function AchievementNotification() {
  const [currentAchievement, setCurrentAchievement] = useState<string | null>(null)
  const [queue, setQueue] = useState<string[]>([])
  const { unlockedAchievements } = useGameState()

  useEffect(() => {
    // Check for new achievements
    const newAchievements = unlockedAchievements.filter(
      (achievement) => !queue.includes(achievement) && currentAchievement !== achievement,
    )

    if (newAchievements.length > 0) {
      setQueue((prev) => [...prev, ...newAchievements])
    }
  }, [unlockedAchievements, queue, currentAchievement])

  useEffect(() => {
    // Display next achievement in queue
    if (queue.length > 0 && !currentAchievement) {
      const nextAchievement = queue[0]
      setCurrentAchievement(nextAchievement)
      setQueue((prev) => prev.slice(1))
    }
  }, [queue, currentAchievement])

  useEffect(() => {
    // Auto-dismiss achievement notification after 5 seconds
    if (currentAchievement) {
      const timer = setTimeout(() => {
        setCurrentAchievement(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [currentAchievement])

  return (
    <AnimatePresence>
      {currentAchievement && achievements[currentAchievement as keyof typeof achievements] && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-20 right-4 z-50 bg-background border border-border shadow-lg rounded-lg p-4 max-w-xs"
        >
          <div className="flex items-start gap-3">
            <div className="bg-primary/20 p-2 rounded-full">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Achievement Unlocked!</h3>
              <p className="font-bold text-base">
                {achievements[currentAchievement as keyof typeof achievements].title}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                {achievements[currentAchievement as keyof typeof achievements].description}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

