"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="w-full bg-black/30 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-12 h-12">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/conspiracycorgi-OPOPXK3o0fbcCBVO6RgLx2NMhpbWel.png"
              alt="Conspiracy Corgi - A corgi wearing a tin foil hat"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span
            className="font-luckiest-guy text-2xl text-orange-500"
            style={{
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            CONSPIRACY CORGI
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {[
            { href: "/", label: "HOME" },
            { href: "/conspiracy-corkboard", label: "CORKBOARD" },
            { href: "/conspiracy-maze", label: "MAZE" },
            { href: "/memeboard", label: "MEMES" },
            { href: "/most-wanted", label: "MOST WANTED" },
            { href: "/conspiracy-videos", label: "VIDEOS" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className={cn("nav-link", pathname === href && "active")}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

