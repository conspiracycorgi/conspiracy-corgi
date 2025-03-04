"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { EvidenceItem } from "@/components/evidence-item"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Eye, Share2 } from "lucide-react"
import { useGameState } from "@/components/game-state-provider"

export default function ConspiracyVideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [watchedVideos, setWatchedVideos] = useState<string[]>([])
  const { unlockAchievement } = useGameState()

  const handleWatchVideo = (video: Video) => {
    if (!watchedVideos.includes(video.id)) {
      const newWatchedVideos = [...watchedVideos, video.id]
      setWatchedVideos(newWatchedVideos)

      // Check if all videos have been watched
      if (newWatchedVideos.length === videos.length) {
        unlockAchievement("video_watcher")
      }
    }
    setSelectedVideo(video)
  }

  return (
    <div className="container py-8 relative">
      <EvidenceItem
        id="videos_evidence_1"
        title="Secret Footage"
        description="Recovered surveillance footage of corgi operations"
        position="bottom-left"
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Conspiracy Videos</h1>
          <p className="text-muted-foreground">
            Exclusive footage revealing the truth about corgi operations around the world.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full content-container">
                <div className="relative aspect-video cursor-pointer group" onClick={() => handleWatchVideo(video)}>
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                  <video src={video.url} poster={video.thumbnail} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-background/20 p-4 backdrop-blur-sm group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  {watchedVideos.includes(video.id) && <Badge className="absolute top-2 right-2">Watched</Badge>}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{video.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{video.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{video.views}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="relative max-w-4xl w-full bg-card rounded-lg shadow-lg overflow-hidden content-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              <video
                src={selectedVideo.url}
                poster={selectedVideo.thumbnail}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
              <p className="text-muted-foreground mb-4">{selectedVideo.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{selectedVideo.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{selectedVideo.views}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

interface Video {
  id: string
  title: string
  description: string
  url: string
  thumbnail: string
  duration: string
  views: string
}

const videos: Video[] = [
  {
    id: "video-1",
    title: "The Royal Corgi Conspiracy",
    description: "Shocking evidence of corgi involvement in royal affairs spanning decades.",
    url: "/videos/royal-corgi-conspiracy.mp4",
    thumbnail: "/images/video-thumb-1.jpg",
    duration: "12:34",
    views: "1.2M",
  },
  {
    id: "video-2",
    title: "Operation Treat Heist",
    description: "Surveillance footage of coordinated treat acquisition operations.",
    url: "/videos/operation-treat-heist.mp4",
    thumbnail: "/images/video-thumb-2.jpg",
    duration: "8:45",
    views: "856K",
  },
  {
    id: "video-3",
    title: "The Corgi Code",
    description: "Breaking down the secret communication methods used by corgi operatives.",
    url: "/videos/corgi-code.mp4",
    thumbnail: "/images/video-thumb-3.jpg",
    duration: "15:20",
    views: "2.1M",
  },
  {
    id: "video-4",
    title: "Underground Sploot Network",
    description: "Exposing the vast network of corgi agents and their secret meetings.",
    url: "/videos/underground-sploot.mp4",
    thumbnail: "/images/video-thumb-4.jpg",
    duration: "10:15",
    views: "987K",
  },
  {
    id: "video-5",
    title: "The Great Corgi Infiltration",
    description: "How corgis have infiltrated the highest levels of government.",
    url: "/videos/corgi-infiltration.mp4",
    thumbnail: "/images/video-thumb-5.jpg",
    duration: "18:30",
    views: "1.5M",
  },
  {
    id: "video-6",
    title: "Decoded: Corgi Mind Control",
    description: "Scientific analysis of corgi cuteness and its effects on human behavior.",
    url: "/videos/corgi-mind-control.mp4",
    thumbnail: "/images/video-thumb-6.jpg",
    duration: "14:45",
    views: "2.3M",
  },
]

