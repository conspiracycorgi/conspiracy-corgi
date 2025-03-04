"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { EvidenceItem } from "@/components/evidence-item"
import { AchievementNotification } from "@/components/achievement-notification"
import { useGameState } from "@/components/game-state-provider"
import { Share2, Heart, MessageSquare, Bookmark, X } from "lucide-react"

export default function MemeboardPage() {
  const [memes, setMemes] = useState<Meme[]>(conspiracyMemes)
  const [viewedMemes, setViewedMemes] = useState<string[]>([])
  const { unlockAchievement } = useGameState()

  useEffect(() => {
    // Load viewed memes from localStorage
    const savedViewedMemes = localStorage.getItem("conspiracyCorgiViewedMemes")
    if (savedViewedMemes) {
      try {
        setViewedMemes(JSON.parse(savedViewedMemes))
      } catch (error) {
        console.error("Failed to parse saved viewed memes:", error)
      }
    }
  }, [])

  useEffect(() => {
    // Save viewed memes to localStorage
    if (viewedMemes.length > 0) {
      localStorage.setItem("conspiracyCorgiViewedMemes", JSON.stringify(viewedMemes))

      // Check if all memes have been viewed
      if (viewedMemes.length === conspiracyMemes.length) {
        unlockAchievement("meme_collector")
      }
    }
  }, [viewedMemes, unlockAchievement])

  const handleMemeView = (id: string) => {
    if (!viewedMemes.includes(id)) {
      setViewedMemes([...viewedMemes, id])
    }
  }

  const handleLike = (id: string) => {
    setMemes(memes.map((meme) => (meme.id === id ? { ...meme, likes: meme.likes + 1, liked: true } : meme)))
  }

  return (
    <div className="container py-8 relative">
      <AchievementNotification />
      <EvidenceItem
        id="meme_evidence_1"
        title="Viral Meme Source"
        description="The origin of corgi conspiracy memes"
        position="top-right"
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Conspiracy Memeboard</h1>
        <div className="bg-primary/20 px-3 py-1 rounded-full text-sm font-medium text-primary">
          {viewedMemes.length}/{conspiracyMemes.length} Viewed
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {memes.map((meme, index) => (
          <MemeCard
            key={meme.id}
            meme={meme}
            index={index}
            onView={handleMemeView}
            onLike={handleLike}
            viewed={viewedMemes.includes(meme.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface Meme {
  id: string
  title: string
  imageUrl: string
  likes: number
  comments: number
  liked?: boolean
  saved?: boolean
}

interface MemeCardProps {
  meme: Meme
  index: number
  onView: (id: string) => void
  onLike: (id: string) => void
  viewed: boolean
}

function MemeCard({ meme, index, onView, onLike, viewed }: MemeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (isExpanded && !viewed) {
      onView(meme.id)
    }
  }, [isExpanded, viewed, meme.id, onView])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`rounded-lg border bg-card shadow-sm overflow-hidden ${viewed ? "ring-1 ring-primary/20" : ""}`}
    >
      <div className="p-3 flex items-center justify-between border-b">
        <h3 className="font-medium truncate">{meme.title}</h3>
        {viewed && <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Viewed</div>}
      </div>

      <div className="relative cursor-pointer overflow-hidden" onClick={() => setIsExpanded(true)}>
        <Image
          src={meme.imageUrl || "/placeholder.svg"}
          alt={meme.title}
          width={500}
          height={500}
          className="w-full h-64 object-cover"
        />

        {!isExpanded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity hover:opacity-0">
            <Button variant="outline" className="bg-background/80 backdrop-blur-sm">
              View Meme
            </Button>
          </div>
        )}
      </div>

      <div className="p-3 flex justify-between">
        <Button variant="ghost" size="sm" className={meme.liked ? "text-red-500" : ""} onClick={() => onLike(meme.id)}>
          <Heart className="h-4 w-4 mr-1" />
          {meme.likes}
        </Button>

        <Button variant="ghost" size="sm">
          <MessageSquare className="h-4 w-4 mr-1" />
          {meme.comments}
        </Button>

        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>

        <Button variant="ghost" size="sm" className={meme.saved ? "text-primary" : ""}>
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={() => setIsExpanded(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative max-w-3xl max-h-[90vh] overflow-auto bg-card rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">{meme.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-8 w-8 p-0"
                onClick={() => setIsExpanded(false)}
              >
                <span className="sr-only">Close</span>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4">
              <Image
                src={meme.imageUrl || "/placeholder.svg"}
                alt={meme.title}
                width={800}
                height={800}
                className="w-full h-auto rounded-md"
              />
            </div>

            <div className="p-4 border-t flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                className={meme.liked ? "text-red-500" : ""}
                onClick={() => onLike(meme.id)}
              >
                <Heart className="h-4 w-4 mr-1" />
                {meme.likes}
              </Button>

              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                {meme.comments}
              </Button>

              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>

              <Button variant="ghost" size="sm" className={meme.saved ? "text-primary" : ""}>
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

// Conspiracy memes data with actual image paths
const conspiracyMemes: Meme[] = [
  {
    id: "meme1",
    title: "The Queen's Secret Agents",
    imageUrl: "/memes/corgi-queen.jpg",
    likes: 1024,
    comments: 128,
  },
  {
    id: "meme2",
    title: "Corgi Ears Are Actually Antennas",
    imageUrl: "/memes/corgi-antenna.jpg",
    likes: 768,
    comments: 96,
  },
  {
    id: "meme3",
    title: "Why Corgis Are Always Listening",
    imageUrl: "/memes/corgi-listening.jpg",
    likes: 512,
    comments: 64,
  },
  {
    id: "meme4",
    title: "The Truth About Corgi Butts",
    imageUrl: "/memes/corgi-butt.jpg",
    likes: 2048,
    comments: 256,
  },
  {
    id: "meme5",
    title: "Corgi Infiltration Plan",
    imageUrl: "/memes/corgi-infiltration.jpg",
    likes: 1536,
    comments: 192,
  },
  {
    id: "meme6",
    title: "Corgi Mind Control",
    imageUrl: "/memes/corgi-mind-control.jpg",
    likes: 896,
    comments: 112,
  },
]

