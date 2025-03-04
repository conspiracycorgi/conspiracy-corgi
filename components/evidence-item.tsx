"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useGameState } from "@/components/game-state-provider"
import { useToast } from "@/components/ui/use-toast"

type EvidenceItemProps = {
  id: string
  title: string
  description: string
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "random"
}

export function EvidenceItem({ id, title, description, position = "random" }: EvidenceItemProps) {
  const [collected, setCollected] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const { collectEvidence, unlockAchievement } = useGameState()
  const { toast } = useToast()

  useEffect(() => {
    // Check if this evidence was already collected
    const savedState = localStorage.getItem("conspiracyCorgiGameState")
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        if (parsedState.collectedEvidence && parsedState.collectedEvidence.includes(id)) {
          setCollected(true)
        }
      } catch (error) {
        console.error("Failed to parse saved evidence state:", error)
      }
    }

    // Set position based on the position prop
    const setRandomPosition = () => {
      const container = document.querySelector("main")
      if (!container) return

      const rect = container.getBoundingClientRect()
      let x, y

      switch (position) {
        case "top-left":
          x = Math.random() * (rect.width / 4)
          y = Math.random() * (rect.height / 4)
          break
        case "top-right":
          x = rect.width - Math.random() * (rect.width / 4) - 64
          y = Math.random() * (rect.height / 4)
          break
        case "bottom-left":
          x = Math.random() * (rect.width / 4)
          y = rect.height - Math.random() * (rect.height / 4) - 64
          break
        case "bottom-right":
          x = rect.width - Math.random() * (rect.width / 4) - 64
          y = rect.height - Math.random() * (rect.height / 4) - 64
          break
        case "random":
        default:
          x = Math.random() * (rect.width - 64)
          y = Math.random() * (rect.height - 64)
      }

      setCoords({ x, y })
    }

    setRandomPosition()
    window.addEventListener("resize", setRandomPosition)

    return () => {
      window.removeEventListener("resize", setRandomPosition)
    }
  }, [id, position])

  const handleCollect = () => {
    if (collected) return

    setCollected(true)
    collectEvidence()

    // Save collected evidence to localStorage
    const savedState = localStorage.getItem("conspiracyCorgiGameState")
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        const collectedEvidence = parsedState.collectedEvidence || []
        if (!collectedEvidence.includes(id)) {
          parsedState.collectedEvidence = [...collectedEvidence, id]
          localStorage.setItem("conspiracyCorgiGameState", JSON.stringify(parsedState))
        }
      } catch (error) {
        console.error("Failed to update saved evidence state:", error)
      }
    } else {
      localStorage.setItem("conspiracyCorgiGameState", JSON.stringify({ collectedEvidence: [id] }))
    }

    // Check if this is the first evidence collected
    if (!savedState || !JSON.parse(savedState).collectedEvidence?.length) {
      unlockAchievement("first_evidence")
    }

    toast({
      title: "Evidence Collected!",
      description: `You found: ${title}`,
      duration: 3000,
    })
  }

  if (collected) return null

  return (
    <motion.div
      className="absolute z-10"
      style={{ left: coords.x, top: coords.y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: Math.random() * 2, duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
    >
      <motion.button
        className="bg-transparent p-0 rounded-full shadow-lg hover:bg-primary/10 transition-colors evidence-glow"
        onClick={handleCollect}
        whileTap={{ scale: 0.9 }}
        aria-label={`Collect evidence: ${title}`}
      >
        <div className="relative h-16 w-16">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/danpepe-o5oUfioQ1nUFKq36mJ9V7TVGS07yAk.gif"
            alt="Suspicious Pepe Evidence"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
      </motion.button>
    </motion.div>
  )
}

