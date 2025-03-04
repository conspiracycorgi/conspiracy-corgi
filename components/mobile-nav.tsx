"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white opacity-70 hover:opacity-100 transition-opacity"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-16 z-50 bg-black/90 backdrop-blur-md"
          >
            <nav className="container py-4">
              <div className="flex items-center gap-2 mb-4 px-2">
                <div className="relative w-8 h-8">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/conspiracycorgi-OPOPXK3o0fbcCBVO6RgLx2NMhpbWel.png"
                    alt="Conspiracy Corgi - A corgi wearing a tin foil hat"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-luckiest-guy text-lg text-orange-500">CONSPIRACY CORGI</span>
              </div>
              {[
                { href: "/", label: "HOME" },
                { href: "/conspiracy-corkboard", label: "CORKBOARD" },
                { href: "/conspiracy-maze", label: "MAZE" },
                { href: "/memeboard", label: "MEMES" },
                { href: "/most-wanted", label: "MOST WANTED" },
                { href: "/conspiracy-videos", label: "VIDEOS" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn("block py-2 nav-link", pathname === href && "active")}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

