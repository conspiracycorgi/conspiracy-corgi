"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { EvidenceItem } from "@/components/evidence-item"
import { AchievementNotification } from "@/components/achievement-notification"
import { useGameState } from "@/components/game-state-provider"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react"

// Maze cell types
type CellType = "wall" | "path" | "start" | "end" | "player" | "visited"

// Direction types
type Direction = "up" | "down" | "left" | "right"

export default function MazePage() {
  const [maze, setMaze] = useState<CellType[][]>([])
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0 })
  const [gameWon, setGameWon] = useState(false)
  const [mazeSize, setMazeSize] = useState({ width: 15, height: 15 })
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const [isGenerating, setIsGenerating] = useState(false)
  const { setMazeCompleted } = useGameState()

  // Generate a new maze
  const generateMaze = useCallback(() => {
    setIsGenerating(true)
    setGameWon(false)

    // Set maze dimensions based on difficulty
    let width, height
    switch (difficulty) {
      case "easy":
        width = 11
        height = 11
        break
      case "medium":
        width = 15
        height = 15
        break
      case "hard":
        width = 21
        height = 21
        break
      default:
        width = 15
        height = 15
    }

    // Ensure odd dimensions for maze generation
    width = width % 2 === 0 ? width + 1 : width
    height = height % 2 === 0 ? height + 1 : height

    setMazeSize({ width, height })

    // Initialize maze with walls
    const newMaze: CellType[][] = Array(height)
      .fill(null)
      .map(() => Array(width).fill("wall"))

    // Recursive backtracking maze generation
    const generatePath = (x: number, y: number) => {
      newMaze[y][x] = "path"

      // Define possible directions to move
      const directions = [
        { dx: 0, dy: -2 }, // Up
        { dx: 0, dy: 2 }, // Down
        { dx: -2, dy: 0 }, // Left
        { dx: 2, dy: 0 }, // Right
      ]

      // Shuffle directions for randomness
      for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[directions[i], directions[j]] = [directions[j], directions[i]]
      }

      // Try each direction
      for (const { dx, dy } of directions) {
        const nx = x + dx
        const ny = y + dy

        // Check if the new position is within bounds and is a wall
        if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && newMaze[ny][nx] === "wall") {
          // Carve a path by setting the cell between current and new position to path
          newMaze[y + dy / 2][x + dx / 2] = "path"
          generatePath(nx, ny)
        }
      }
    }

    // Start maze generation from a random position
    const startX = 1
    const startY = 1
    generatePath(startX, startY)

    // Set start position
    newMaze[startY][startX] = "start"
    setPlayerPosition({ x: startX, y: startY })

    // Set end position (opposite corner or random far position)
    let endX, endY

    // Find a valid end position that's far from start
    do {
      endX = width - 2
      endY = height - 2

      // Ensure the end position is a path
      if (newMaze[endY][endX] !== "path") {
        // Find a nearby path cell
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = endX + dx
            const ny = endY + dy
            if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && newMaze[ny][nx] === "path") {
              endX = nx
              endY = ny
            }
          }
        }
      }
    } while (newMaze[endY][endX] !== "path")

    newMaze[endY][endX] = "end"
    setEndPosition({ x: endX, y: endY })

    setMaze(newMaze)
    setIsGenerating(false)
  }, [difficulty])

  // Initialize maze on component mount
  useEffect(() => {
    generateMaze()
  }, [generateMaze])

  // Move player in the specified direction
  const movePlayer = useCallback(
    (direction: Direction) => {
      if (gameWon) return

      const { x, y } = playerPosition
      let newX = x
      let newY = y

      switch (direction) {
        case "up":
          newY = y - 1
          break
        case "down":
          newY = y + 1
          break
        case "left":
          newX = x - 1
          break
        case "right":
          newX = x + 1
          break
      }

      // Check if the new position is valid (not a wall and within bounds)
      if (newX >= 0 && newX < mazeSize.width && newY >= 0 && newY < mazeSize.height && maze[newY][newX] !== "wall") {
        // Update player position
        setPlayerPosition({ x: newX, y: newY })

        // Mark the previous position as visited
        const newMaze = [...maze]
        if (newMaze[y][x] !== "start") {
          newMaze[y][x] = "visited"
        }

        // Check if player reached the end
        if (newMaze[newY][newX] === "end") {
          setGameWon(true)
          setMazeCompleted()
        }

        setMaze(newMaze)
      }
    },
    [playerPosition, maze, mazeSize, gameWon, setMazeCompleted],
  )

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameWon) return

      let direction: Direction | null = null

      switch (e.key) {
        case "ArrowUp":
        case "w":
          direction = "up"
          break
        case "ArrowDown":
        case "s":
          direction = "down"
          break
        case "ArrowLeft":
        case "a":
          direction = "left"
          break
        case "ArrowRight":
        case "d":
          direction = "right"
          break
      }

      if (direction) {
        movePlayer(direction)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameWon, movePlayer])

  // Reset the maze
  const resetMaze = () => {
    generateMaze()
  }

  // Change difficulty
  const changeDifficulty = (newDifficulty: "easy" | "medium" | "hard") => {
    if (difficulty !== newDifficulty) {
      setDifficulty(newDifficulty)
      setTimeout(() => generateMaze(), 100)
    }
  }

  return (
    <div className="container py-8 relative">
      <AchievementNotification />
      <EvidenceItem
        id="maze_evidence_1"
        title="Secret Map"
        description="A map showing corgi infiltration routes"
        position="bottom-right"
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Conspiracy Maze</h1>
        <div className="flex gap-2">
          <Button
            variant={difficulty === "easy" ? "default" : "outline"}
            size="sm"
            onClick={() => changeDifficulty("easy")}
            disabled={isGenerating}
          >
            Easy
          </Button>
          <Button
            variant={difficulty === "medium" ? "default" : "outline"}
            size="sm"
            onClick={() => changeDifficulty("medium")}
            disabled={isGenerating}
          >
            Medium
          </Button>
          <Button
            variant={difficulty === "hard" ? "default" : "outline"}
            size="sm"
            onClick={() => changeDifficulty("hard")}
            disabled={isGenerating}
          >
            Hard
          </Button>
          <Button variant="outline" size="sm" onClick={resetMaze} disabled={isGenerating}>
            <RefreshCw className="h-4 w-4 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Game instructions with updated styling */}
      <div className="mb-6 text-center max-w-md mx-auto">
        <p className="small-orange-text">
          Navigate through the maze to find the truth! Use arrow keys or the controls below to move.
        </p>
      </div>

      {/* Maze grid */}
      <div className="relative mb-6 overflow-hidden rounded-lg border shadow-md">
        {isGenerating ? (
          <div className="flex items-center justify-center h-[300px] w-[300px] md:h-[500px] md:w-[500px] bg-muted">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div
            className="grid gap-0 bg-muted"
            style={{
              gridTemplateColumns: `repeat(${mazeSize.width}, 1fr)`,
              width: mazeSize.width <= 15 ? "300px" : "500px",
              height: mazeSize.height <= 15 ? "300px" : "500px",
            }}
          >
            {maze.map((row, y) =>
              row.map((cell, x) => {
                const isPlayer = playerPosition.x === x && playerPosition.y === y
                const cellType = isPlayer ? "player" : cell

                return (
                  <div
                    key={`${x}-${y}`}
                    className={`maze-cell ${cellType}`}
                    style={{
                      width: mazeSize.width <= 15 ? `${300 / mazeSize.width}px` : `${500 / mazeSize.width}px`,
                      height: mazeSize.height <= 15 ? `${300 / mazeSize.height}px` : `${500 / mazeSize.height}px`,
                    }}
                  >
                    {isPlayer && (
                      <motion.div
                        className="w-full h-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design%2812%29-FyRxkl1pTivdzAZqxnO0XpMCDA0Mkg.png"
                          alt="Conspiracy Corgi"
                          width={mazeSize.width <= 15 ? 24 : 32}
                          height={mazeSize.width <= 15 ? 24 : 32}
                          className="object-contain"
                        />
                      </motion.div>
                    )}
                    {cell === "end" && (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image
                          src="/images/evidence-folder.png"
                          alt="Evidence"
                          width={mazeSize.width <= 15 ? 16 : 20}
                          height={mazeSize.width <= 15 ? 16 : 20}
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                )
              }),
            )}
          </div>
        )}

        {/* Win overlay */}
        {gameWon && (
          <motion.div
            className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-center bg-background/95 backdrop-blur-sm p-8 rounded-lg max-w-md"
            >
              <Image
                src="/images/corgi-success.gif"
                alt="Corgi Success"
                width={200}
                height={200}
                className="mx-auto mb-4 rounded-lg"
              />
              <h2 className="text-4xl font-bold font-luckiest-guy mb-4">
                <span className="text-orange-500 hero-text">YOU FOUND THE</span>
                <br />
                <span className="text-white hero-text">TRUTH!</span>
              </h2>
              <p className="text-xl mb-6 small-orange-text">
                Congratulations! You've successfully navigated the conspiracy maze.
              </p>
              <Button onClick={resetMaze} className="font-luckiest-guy text-lg">
                Play Again
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Mobile controls */}
      <div className="grid grid-cols-3 gap-2 mt-4 md:mt-6">
        <div className="col-start-2">
          <Button variant="outline" className="w-12 h-12 p-0" onClick={() => movePlayer("up")} disabled={gameWon}>
            <ArrowUp className="h-6 w-6" />
          </Button>
        </div>
        <div className="col-start-1 row-start-2">
          <Button variant="outline" className="w-12 h-12 p-0" onClick={() => movePlayer("left")} disabled={gameWon}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>
        <div className="col-start-2 row-start-2">
          <Button variant="outline" className="w-12 h-12 p-0" onClick={() => movePlayer("down")} disabled={gameWon}>
            <ArrowDown className="h-6 w-6" />
          </Button>
        </div>
        <div className="col-start-3 row-start-2">
          <Button variant="outline" className="w-12 h-12 p-0" onClick={() => movePlayer("right")} disabled={gameWon}>
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h3 className="text-xl font-luckiest-guy heading-text mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-zinc-700">Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-zinc-700">End</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-zinc-700">Player</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary/80 rounded"></div>
            <span className="text-zinc-700">Wall</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-200 rounded"></div>
            <span className="text-zinc-700">Visited</span>
          </div>
        </div>
      </div>
    </div>
  )
}

