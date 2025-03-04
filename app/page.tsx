"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ParticleBackground } from "@/components/particle-background"
import { Button } from "@/components/ui/button"
import { EvidenceItem } from "@/components/evidence-item"
import { AchievementNotification } from "@/components/achievement-notification"
import { useGameState } from "@/components/game-state-provider"
import { MapPin, FileText, Film, Laugh, Search, UserRound, ArrowRight, Award, Lock } from "lucide-react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { evidenceCount } = useGameState()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <AchievementNotification />

      <section className="container py-12 md:py-24 lg:py-32 relative">
        <EvidenceItem
          id="home_evidence_1"
          title="Secret Document"
          description="A classified document about corgi operations"
          position="top-right"
        />

        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-luckiest-guy"
          >
            <span className="text-orange-500 hero-text">UNCOVER THE TRUTH WITH </span>
            <span className="text-white hero-text">ADORABLE CORGIS</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-[700px] text-lg small-orange-text"
          >
            Join our team of corgi detectives as they investigate the world's greatest conspiracies. Collect evidence,
            connect the dots, and uncover the truth!
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/conspiracy-corkboard">
                Start Investigating <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-background hover:bg-accent hover:text-accent-foreground"
            >
              <Link href="/conspiracy-maze">Try the Maze</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group relative overflow-hidden rounded-lg border bg-background/80 backdrop-blur-sm p-6 shadow-md transition-all hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
              <p className="mt-2 small-orange-text">{feature.description}</p>
              <Link href={feature.href} className="mt-4 inline-flex items-center text-primary hover:underline">
                Explore <ArrowRight className="ml-1 h-4 w-4" />
              </Link>

              {/* Decorative background circle */}
              <div className="absolute bottom-0 right-0 h-24 w-24 translate-x-1/3 translate-y-1/3 rounded-full bg-primary/10 opacity-50 transition-transform group-hover:scale-150" />

              {/* Animated corgi image */}
              <motion.div
                className="absolute bottom-0 right-0 w-24 h-24 opacity-0 translate-y-full transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                initial={false}
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%2812%29-1f6Xb1xFXDqDUFSETFkwV3dyBiCDDg.png"
                  alt="Conspiracy Corgi"
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container py-12 md:py-24 relative">
        <EvidenceItem
          id="home_evidence_2"
          title="Mysterious Photo"
          description="A blurry photo of what might be a corgi in a trenchcoat"
          position="bottom-left"
        />

        <div className="mx-auto max-w-[980px]">
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Your Progress</h2>
            <p className="small-orange-text">Track your investigation and unlock achievements</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg border bg-background p-6 shadow-md"
            >
              <h3 className="text-xl font-bold">Evidence Collected</h3>
              <div className="mt-4 flex items-center gap-2">
                <div className="relative h-6 flex-1 rounded-full bg-muted">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min((evidenceCount / 10) * 100, 100)}%` }}
                  />
                </div>
                <span className="font-medium small-orange-text">{evidenceCount}/10</span>
              </div>
              <p className="mt-2 text-sm small-orange-text">
                Find hidden evidence across the site to unlock special content
              </p>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg border bg-background p-6 shadow-md"
            >
              <h3 className="text-xl font-bold">Achievements</h3>
              <ul className="mt-4 space-y-2">
                {Object.entries(achievements).map(([id, achievement], index) => (
                  <AchievementItem key={id} id={id} achievement={achievement} index={index} />
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-24">
        <div className="mx-auto max-w-[980px] grid gap-8 md:grid-cols-2 items-center">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <Image
              src="/images/corgi-detective.jpg"
              alt="Corgi Detective"
              width={500}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <h2 className="text-3xl font-luckiest-guy heading-text">Join the Investigation</h2>
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <p className="small-orange-text mb-4 leading-relaxed">
                Our team of highly trained corgi agents are working tirelessly to uncover the truth behind the world's
                greatest conspiracies. With their keen sense of smell, adorable waddle, and uncanny ability to look cute
                while doing serious detective work, they're the perfect operatives for covert missions.
              </p>
              <p className="small-orange-text leading-relaxed">
                Your mission, should you choose to accept it, is to help our corgi agents connect the dots, solve
                puzzles, and collect evidence to expose the truth!
              </p>
            </div>
            <Button asChild className="mt-4 self-start font-luckiest-guy">
              <Link href="/conspiracy-corkboard">
                Start Your Mission <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function AchievementItem({
  id,
  achievement,
  index,
}: { id: string; achievement: { title: string; description: string }; index: number }) {
  const { hasUnlockedAchievement } = useGameState()
  const isUnlocked = hasUnlockedAchievement(id)

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className={`flex items-center gap-3 rounded-md p-2 ${isUnlocked ? "bg-primary/10" : "bg-muted"}`}
    >
      <div
        className={`rounded-full p-1 ${isUnlocked ? "bg-primary/20 text-primary" : "bg-muted-foreground/20 text-muted-foreground"}`}
      >
        {isUnlocked ? <Award className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
      </div>
      <div>
        <p className={`font-medium small-orange-text ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
          {achievement.title}
        </p>
        {isUnlocked && <p className="text-xs small-orange-text">{achievement.description}</p>}
      </div>
    </motion.li>
  )
}

const features = [
  {
    title: "Conspiracy Corkboard",
    description: "Connect the dots and uncover the hidden connections between seemingly unrelated events.",
    icon: <Search className="h-6 w-6" />,
    href: "/conspiracy-corkboard",
  },
  {
    title: "Conspiracy Maze",
    description: "Navigate through the labyrinth of misinformation to find the truth at the center.",
    icon: <MapPin className="h-6 w-6" />,
    href: "/conspiracy-maze",
  },
  {
    title: "Conspiracy Videos",
    description: "Watch exclusive footage that the mainstream media doesn't want you to see.",
    icon: <Film className="h-6 w-6" />,
    href: "/conspiracy-videos",
  },
  {
    title: "Memeboard",
    description: "Laugh at the absurdity of it all with our collection of conspiracy memes.",
    icon: <Laugh className="h-6 w-6" />,
    href: "/memeboard",
  },
  {
    title: "Most Wanted",
    description: "Meet the shadowy figures pulling the strings behind the scenes.",
    icon: <UserRound className="h-6 w-6" />,
    href: "/most-wanted",
  },
  {
    title: "Secret Files",
    description: "Browse through declassified documents that reveal shocking truths.",
    icon: <FileText className="h-6 w-6" />,
    href: "/conspiracy-corkboard",
  },
]

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

