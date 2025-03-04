"use client"

import { Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  return (
    <Button variant="ghost" size="icon" className="text-white opacity-70 hover:opacity-100 transition-opacity">
      <Moon className="h-5 w-5" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

