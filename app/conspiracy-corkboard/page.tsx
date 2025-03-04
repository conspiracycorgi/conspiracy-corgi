"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { EvidenceItem } from "@/components/evidence-item"
import { AchievementNotification } from "@/components/achievement-notification"
import { useGameState } from "@/components/game-state-provider"
import { Trash2, Save, Plus, X } from "lucide-react"

export default function CorkboardPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState<Point | null>(null)
  const [currentLine, setCurrentLine] = useState<Line | null>(null)
  const [newNoteText, setNewNoteText] = useState("")
  const [showNewNoteForm, setShowNewNoteForm] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const corkboardRef = useRef<HTMLDivElement>(null)
  const { setDotsConnected } = useGameState()

  // Load saved state
  useEffect(() => {
    const savedNotes = localStorage.getItem("conspiracyCorgiNotes")
    const savedConnections = localStorage.getItem("conspiracyCorgiConnections")

    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes))
      } catch (error) {
        console.error("Failed to parse saved notes:", error)
      }
    } else {
      // Initialize with default notes if none exist
      setNotes(defaultNotes)
    }

    if (savedConnections) {
      try {
        setConnections(JSON.parse(savedConnections))
      } catch (error) {
        console.error("Failed to parse saved connections:", error)
      }
    }
  }, [])

  // Save state when it changes
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("conspiracyCorgiNotes", JSON.stringify(notes))
    }

    if (connections.length > 0) {
      localStorage.setItem("conspiracyCorgiConnections", JSON.stringify(connections))
    }

    // Check if all default notes are connected
    if (notes.length >= defaultNotes.length && connections.length >= 5) {
      setDotsConnected()
    }
  }, [notes, connections, setDotsConnected])

  const handleMouseDown = (e: React.MouseEvent, noteId: string) => {
    if (isDragging) return

    setIsDrawing(true)
    const rect = corkboardRef.current?.getBoundingClientRect()
    if (!rect) return

    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      noteId,
    }

    setStartPoint(point)
    setCurrentLine({
      start: point,
      end: point,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint || !corkboardRef.current) return

    const rect = corkboardRef.current.getBoundingClientRect()
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    setCurrentLine({
      start: startPoint,
      end: point,
    })
  }

  const handleMouseUp = (e: React.MouseEvent, noteId?: string) => {
    if (!isDrawing || !startPoint || !noteId || startPoint.noteId === noteId) {
      setIsDrawing(false)
      setStartPoint(null)
      setCurrentLine(null)
      return
    }

    // Create a new connection
    const newConnection = {
      id: `${startPoint.noteId}-${noteId}`,
      from: startPoint.noteId,
      to: noteId,
    }

    // Check if this connection already exists
    const connectionExists = connections.some(
      (conn) =>
        (conn.from === startPoint.noteId && conn.to === noteId) ||
        (conn.from === noteId && conn.to === startPoint.noteId),
    )

    if (!connectionExists) {
      setConnections([...connections, newConnection])
    }

    setIsDrawing(false)
    setStartPoint(null)
    setCurrentLine(null)
  }

  const handleDragStart = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault()
    setIsDragging(true)

    const note = notes.find((n) => n.id === noteId)
    if (!note || !corkboardRef.current) return

    const rect = corkboardRef.current.getBoundingClientRect()
    const startX = e.clientX - rect.left - note.x
    const startY = e.clientY - rect.top - note.y

    const handleMouseMove = (e: MouseEvent) => {
      if (!corkboardRef.current) return

      const rect = corkboardRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(rect.width - 200, e.clientX - rect.left - startX))
      const y = Math.max(0, Math.min(rect.height - 200, e.clientY - rect.top - startY))

      setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, x, y } : n)))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const addNewNote = () => {
    if (!newNoteText.trim() || !corkboardRef.current) return

    const rect = corkboardRef.current.getBoundingClientRect()
    const newNote: Note = {
      id: `note-${Date.now()}`,
      text: newNoteText,
      x: Math.random() * (rect.width - 200),
      y: Math.random() * (rect.height - 200),
      color: getRandomColor(),
    }

    setNotes([...notes, newNote])
    setNewNoteText("")
    setShowNewNoteForm(false)
  }

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
    setConnections(connections.filter((conn) => conn.from !== noteId && conn.to !== noteId))
  }

  const deleteConnection = (connectionId: string) => {
    setConnections(connections.filter((conn) => conn.id !== connectionId))
  }

  const clearBoard = () => {
    if (window.confirm("Are you sure you want to clear the board? This will delete all notes and connections.")) {
      setNotes([])
      setConnections([])
      localStorage.removeItem("conspiracyCorgiNotes")
      localStorage.removeItem("conspiracyCorgiConnections")
    }
  }

  const resetToDefault = () => {
    if (window.confirm("Are you sure you want to reset to default? This will replace all your current notes.")) {
      setNotes(defaultNotes)
      setConnections([])
    }
  }

  return (
    <div className="container py-8 relative">
      <AchievementNotification />
      <EvidenceItem
        id="corkboard_evidence_1"
        title="Classified Memo"
        description="A memo about corgi infiltration in high places"
        position="top-left"
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Conspiracy Corkboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowNewNoteForm(true)} disabled={showNewNoteForm}>
            <Plus className="h-4 w-4 mr-1" /> Add Note
          </Button>
          <Button variant="outline" size="sm" onClick={resetToDefault}>
            <Save className="h-4 w-4 mr-1" /> Reset
          </Button>
          <Button variant="destructive" size="sm" onClick={clearBoard}>
            <Trash2 className="h-4 w-4 mr-1" /> Clear
          </Button>
        </div>
      </div>

      <div
        ref={corkboardRef}
        className="relative bg-amber-100 dark:bg-amber-950/30 rounded-lg min-h-[600px] shadow-inner p-4 overflow-hidden"
        onMouseMove={handleMouseMove}
        style={{ backgroundImage: "url('/images/cork-texture.jpg')", backgroundSize: "cover" }}
      >
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {connections.map((connection) => {
            const fromNote = notes.find((note) => note.id === connection.from)
            const toNote = notes.find((note) => note.id === connection.to)

            if (!fromNote || !toNote) return null

            const fromX = fromNote.x + 100
            const fromY = fromNote.y + 75
            const toX = toNote.x + 100
            const toY = toNote.y + 75

            return (
              <g key={connection.id} onClick={() => deleteConnection(connection.id)}>
                <line x1={fromX} y1={fromY} x2={toX} y2={toY} stroke="red" strokeWidth="2" className="cursor-pointer" />
                <circle cx={(fromX + toX) / 2} cy={(fromY + toY) / 2} r="5" fill="red" className="cursor-pointer" />
              </g>
            )
          })}

          {/* Current line being drawn */}
          {currentLine && (
            <line
              x1={currentLine.start.x}
              y1={currentLine.start.y}
              x2={currentLine.end.x}
              y2={currentLine.end.y}
              stroke="red"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
        </svg>

        {/* Notes */}
        {notes.map((note) => (
          <motion.div
            key={note.id}
            className="absolute shadow-md rounded-md overflow-hidden cursor-move"
            style={{
              left: note.x,
              top: note.y,
              width: 200,
              backgroundColor: note.color,
              zIndex: isDragging ? 30 : 20,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onMouseDown={(e) => {
              if (e.button === 0) {
                // Left click
                if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("note-content")) {
                  handleDragStart(e, note.id)
                }
              }
            }}
          >
            <div
              className="p-3 note-content"
              onMouseDown={(e) => handleMouseDown(e, note.id)}
              onMouseUp={(e) => handleMouseUp(e, note.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="w-6 h-6 bg-red-500 rounded-full" />
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-gray-700 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{note.text}</p>
              {note.image && (
                <div className="mt-2">
                  <Image
                    src={note.image || "/placeholder.svg"}
                    alt="Evidence"
                    width={180}
                    height={120}
                    className="rounded-sm"
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* New note form */}
        {showNewNoteForm && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border border-border rounded-lg shadow-lg p-4 w-80 z-50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Add New Note</h3>
              <button onClick={() => setShowNewNoteForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <textarea
              className="w-full p-2 border rounded-md mb-3 bg-background"
              rows={4}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Enter your conspiracy note..."
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowNewNoteForm(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={addNewNote} disabled={!newNoteText.trim()}>
                Add Note
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          Drag notes to move them. Click and drag between notes to create connections. Click on a red dot to delete a
          connection.
        </p>
      </div>
    </div>
  )
}

// Types
type Point = {
  x: number
  y: number
  noteId?: string
}

type Line = {
  start: Point
  end: Point
}

type Note = {
  id: string
  text: string
  x: number
  y: number
  color: string
  image?: string
}

type Connection = {
  id: string
  from: string
  to: string
}

// Helper functions
function getRandomColor() {
  const colors = [
    "#fff8c4", // Light yellow
    "#ffecb3", // Light orange
    "#e6ee9c", // Light green
    "#b2dfdb", // Light teal
    "#bbdefb", // Light blue
    "#d1c4e9", // Light purple
    "#f8bbd0", // Light pink
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Default notes with actual images
const defaultNotes: Note[] = [
  {
    id: "note-1",
    text: "Corgis have been observed in multiple government facilities. Coincidence?",
    x: 50,
    y: 50,
    color: "#fff8c4",
    image: "/images/corgi-evidence-1.jpg",
  },
  {
    id: "note-2",
    text: "The Queen's corgis had unprecedented access to classified information for decades.",
    x: 300,
    y: 150,
    color: "#ffecb3",
    image: "/images/corgi-evidence-2.jpg",
  },
  {
    id: "note-3",
    text: "Corgi ears are the perfect shape for intercepting radio signals.",
    x: 100,
    y: 300,
    color: "#e6ee9c",
    image: "/images/corgi-evidence-3.jpg",
  },
  {
    id: "note-4",
    text: "Corgis were bred to be short so they could hide under furniture and eavesdrop.",
    x: 400,
    y: 350,
    color: "#bbdefb",
    image: "/images/corgi-evidence-4.jpg",
  },
  {
    id: "note-5",
    text: "The corgi butt wiggle is actually a coded message to other operatives.",
    x: 250,
    y: 500,
    color: "#d1c4e9",
    image: "/images/corgi-evidence-5.jpg",
  },
]

