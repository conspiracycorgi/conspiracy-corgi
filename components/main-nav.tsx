"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/conspiracy-corkboard", label: "Corkboard" },
  { href: "/conspiracy-maze", label: "Maze" },
  { href: "/memeboard", label: "Memes" },
  { href: "/most-wanted", label: "Most Wanted" },
  { href: "/conspiracy-videos", label: "Videos" },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "relative transition-colors hover:text-foreground/80",
            pathname === item.href ? "text-foreground" : "text-foreground/60",
          )}
        >
          {item.label}
          {pathname === item.href && (
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary"
              layoutId="navbar-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </Link>
      ))}
    </nav>
  )
}

