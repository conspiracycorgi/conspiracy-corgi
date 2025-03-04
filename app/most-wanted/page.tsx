"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { EvidenceItem } from "@/components/evidence-item"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

export default function MostWantedPage() {
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(null)

  return (
    <div className="container py-8 relative">
      <EvidenceItem
        id="most_wanted_evidence_1"
        title="Classified Dossier"
        description="Top secret files on corgi operatives"
        position="top-right"
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold heading-text">Most Wanted</h1>
          <p className="small-orange-text">
            These dangerous corgi operatives have been spotted across time and space. Approach with extreme caution!
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {suspects.map((suspect, index) => (
            <motion.div
              key={suspect.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full flex flex-col" style={{ height: "500px" }}>
                <div className="relative h-64">
                  <Image src={suspect.image || "/placeholder.svg"} alt={suspect.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <Badge variant={suspect.status === "At Large" ? "destructive" : "secondary"} className="mb-2">
                      {suspect.status}
                    </Badge>
                    <h3 className="text-xl font-bold text-orange-500 hero-text">{suspect.name}</h3>
                  </div>
                </div>
                <CardContent className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-sm small-orange-text mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>Last seen: {suspect.lastSeen}</span>
                  </div>
                  <p className="text-sm mb-4 small-orange-text">{suspect.description}</p>
                  <div className="mt-auto pt-4">
                    <Button className="w-full" variant="outline" onClick={() => setSelectedSuspect(suspect)}>
                      View Full Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Suspect Profile Modal */}
      {selectedSuspect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setSelectedSuspect(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="relative max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              <Image
                src={selectedSuspect.image || "/placeholder.svg"}
                alt={selectedSuspect.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl heading-text">{selectedSuspect.name}</h2>
                  <p className="text-zinc-600">Code Name: {selectedSuspect.codeName}</p>
                </div>
                <Badge variant={selectedSuspect.status === "At Large" ? "destructive" : "secondary"}>
                  {selectedSuspect.status}
                </Badge>
              </div>

              <div className="grid gap-4">
                <div>
                  <h3 className="font-semibold mb-2 heading-text">Known Activities</h3>
                  <ul className="list-disc list-inside text-zinc-600">
                    {selectedSuspect.activities.map((activity, index) => (
                      <li key={index}>{activity}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 heading-text">Threat Assessment</h3>
                  <div className="flex items-center gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-full rounded-full ${
                          index < selectedSuspect.threatLevel ? "bg-red-500" : "bg-zinc-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 heading-text">Last Known Location</h3>
                  <p className="text-zinc-600">{selectedSuspect.lastSeen}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 heading-text">Notes</h3>
                  <p className="text-zinc-600">{selectedSuspect.notes}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setSelectedSuspect(null)}>
                  Close Profile
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

interface Suspect {
  id: string
  name: string
  codeName: string
  image: string
  status: "At Large" | "Under Surveillance" | "Captured"
  lastSeen: string
  description: string
  activities: string[]
  threatLevel: number
  notes: string
}

const suspects: Suspect[] = [
  {
    id: "suspect-1",
    name: "Ranger Ruffington",
    codeName: "The Outlaw",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Se%20busca.png-kRykdWG5IpL1UwUW4UKgaQvOj57Wjj.jpeg",
    status: "At Large",
    lastSeen: "Old West Territory",
    description: "A notorious bandit known for orchestrating elaborate treat heists across the frontier.",
    activities: [
      "Leading treat wagon robberies",
      "Organizing underground bark networks",
      "Training other corgis in the art of the quick-draw tail wag",
    ],
    threatLevel: 4,
    notes: "Extremely charming. Can convince any human to give up their treats with a single puppy-dog look.",
  },
  {
    id: "suspect-2",
    name: "Agent Shadow",
    codeName: "The Operative",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sf%20corgi.png-CYY9gtDgqddk1dTKNZPsp69f7P27Oa.jpeg",
    status: "Under Surveillance",
    lastSeen: "Various Military Installations",
    description: "Elite tactical operative specializing in covert infiltration and treat extraction.",
    activities: [
      "Infiltrating high-security kennels",
      "Tactical treat acquisition",
      "Training new recruits in stealth techniques",
    ],
    threatLevel: 5,
    notes: "Masters of disguise. Can blend into any environment using advanced tactical gear.",
  },
  {
    id: "suspect-3",
    name: "Bjorn Borksson",
    codeName: "The Raider",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/viking%20corgi.png-ewudMEqI1oZDSC1pwmFAUVo8LvA7lk.jpeg",
    status: "At Large",
    lastSeen: "Nordic Territories",
    description: "Ancient warrior from the frozen north, leads raids on treat stockpiles.",
    activities: ["Organizing treat raids", "Building alliances with wolf packs", "Spreading tales of legendary treats"],
    threatLevel: 4,
    notes: "Claims to be blessed by the Norse gods with unlimited stomach capacity for treats.",
  },
  {
    id: "suspect-4",
    name: "Professor Pawsworth",
    codeName: "The Inventor",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/steampunk%20corgi.png-AVPW0kml7oktNydByu6PYZf97M8sEl.jpeg",
    status: "Under Surveillance",
    lastSeen: "Victorian London",
    description: "Brilliant but eccentric inventor creating treat-snatching contraptions.",
    activities: [
      "Building automated treat dispensers",
      "Creating mechanical squirrel distractions",
      "Designing elaborate treat-stealing machines",
    ],
    threatLevel: 3,
    notes: "Has a particular fondness for pocket watches and steam-powered belly rub machines.",
  },
  {
    id: "suspect-5",
    name: "Shogun Shiba",
    codeName: "The Warrior",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/samuri%20corgi.png-auxQK1EfdCP7qjg65j1v27TJQDZuWz.jpeg",
    status: "At Large",
    lastSeen: "Ancient Japan",
    description: "Master of ancient treat-acquiring arts and leader of the Corgi Clan.",
    activities: [
      "Teaching secret treat-finding techniques",
      "Maintaining ancient scroll of treat recipes",
      "Leading midnight treat raids",
    ],
    threatLevel: 4,
    notes: "Follows a strict code of honor: never take the last treat without sharing.",
  },
  {
    id: "suspect-6",
    name: "Unit K-9000",
    codeName: "The Machine",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cyborg%20corgi.png-5Bugl35ZsrEH4ksdzrcxp7VOx95RZS.jpeg",
    status: "Under Surveillance",
    lastSeen: "Future Timeline",
    description: "Advanced cyber-corgi from the future with enhanced treat-detection capabilities.",
    activities: ["Hacking treat dispensers", "Time traveling for rare treats", "Upgrading other corgis with tech"],
    threatLevel: 5,
    notes: "Powered by a treat-based fusion reactor. Can detect treats through walls.",
  },
  {
    id: "suspect-7",
    name: "Silent Paw",
    codeName: "The Shadow",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/assassin%20corgi.png-J0P1O5v4rJq7hCCOG001ZX0wGTa0eb.jpeg",
    status: "At Large",
    lastSeen: "Global Shadow Network",
    description: "Master of stealth and leader of the hidden Treat Brotherhood.",
    activities: ["Infiltrating treat facilities", "Training shadow operatives", "Maintaining secret treat caches"],
    threatLevel: 5,
    notes: "Never seen without signature hood. Can disappear in plain sight.",
  },
  {
    id: "suspect-8",
    name: "Binary Bark",
    codeName: "The Hacker",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hacker%20corgi.png-VL7QgcdizDYqQnpP0MQHmah4sN45Ge.jpeg",
    status: "Under Surveillance",
    lastSeen: "The Dark Web",
    description: "Cyber criminal mastermind behind numerous digital treat heists.",
    activities: ["Hacking pet store databases", "Creating treat cryptocurrency", "Running underground treat markets"],
    threatLevel: 4,
    notes: "Known for wearing signature black hoodie. Can hack any treat dispenser.",
  },
  {
    id: "suspect-9",
    name: "Lord Biscuit",
    codeName: "The Gentleman",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/madhat.png-NEPHU8syGG2yxiKZu9XQNkCpnIl7cL.jpeg",
    status: "At Large",
    lastSeen: "High Society Events",
    description: "Sophisticated criminal mastermind operating in elite social circles.",
    activities: [
      "Organizing high-stakes treat heists",
      "Running underground treat gambling rings",
      "Manipulating the global treat market",
    ],
    threatLevel: 5,
    notes: "Extremely sophisticated. Never seen without signature top hat and monocle.",
  },
]

