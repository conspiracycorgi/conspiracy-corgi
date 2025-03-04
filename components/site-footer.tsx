import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <p className="text-center small-orange-text md:text-left">
          &copy; {new Date().getFullYear()} Conspiracy Corgi. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:text-foreground transition-colors"
          >
            <Twitter className="h-5 w-5" />
            <span className="sr-only small-orange-text">Twitter</span>
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only small-orange-text">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

