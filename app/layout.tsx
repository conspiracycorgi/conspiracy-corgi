import type React from "react"
import type { Metadata } from "next"
import { Luckiest_Guy } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@/components/analytics"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Toaster } from "@/components/ui/toaster"
import { GameStateProvider } from "@/components/game-state-provider"
import "./globals.css"

const luckiestGuy = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-luckiest-guy",
})

export const metadata: Metadata = {
  title: {
    default: "Conspiracy Corgi - Uncover the Truth with Adorable Corgis",
    template: "%s | Conspiracy Corgi",
  },
  description:
    "Join our adorable corgi detectives as they uncover the world's greatest conspiracies in this interactive experience.",
  keywords: ["conspiracy", "corgi", "interactive", "game", "memes", "conspiracy theories", "dogs"],
  authors: [{ name: "Conspiracy Corgi Team" }],
  creator: "Conspiracy Corgi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://conspiracycorgi.com",
    title: "Conspiracy Corgi - Uncover the Truth with Adorable Corgis",
    description:
      "Join our adorable corgi detectives as they uncover the world's greatest conspiracies in this interactive experience.",
    siteName: "Conspiracy Corgi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conspiracy Corgi - Uncover the Truth with Adorable Corgis",
    description:
      "Join our adorable corgi detectives as they uncover the world's greatest conspiracies in this interactive experience.",
    creator: "@conspiracycorgi",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={luckiestGuy.variable}>
      <head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <GameStateProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
            <Toaster />
            <Analytics />
          </GameStateProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'