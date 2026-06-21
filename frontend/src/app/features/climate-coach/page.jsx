"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, Trophy, Flame, Leaf, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/firebase/AuthContext"
import { logActivity } from "@/lib/firebase/firestore"
const initialMissions = [
  { id: 1, title: "Use metro twice this week", impact: "15 kg CO2 saved", completed: false, category: "Transport" },
  { id: 2, title: "Avoid one food delivery", impact: "3 kg CO2 saved", completed: true, category: "Food" },
  { id: 3, title: "Carry reusable bottle for 3 days", impact: "0.5 kg CO2 saved", completed: false, category: "Lifestyle" },
]

export default function ClimateCoachPage() {
  const [missions, setMissions] = useState(initialMissions)
  const [isGenerating, setIsGenerating] = useState(false)
  const { user } = useAuth()

  const toggleMission = async (id) => {
    const mission = missions.find(m => m.id === id)
    const isNowCompleted = !mission.completed
    
    setMissions(missions.map(m => m.id === id ? { ...m, completed: isNowCompleted } : m))

    if (isNowCompleted && user) {
      // Parse impact number out of string like "15 kg CO2 saved"
      const co2ImpactMatch = mission.impact.match(/([\d.]+)/)
      const co2Impact = co2ImpactMatch ? -parseFloat(co2ImpactMatch[1]) : 0 // Negative because it's saved

      await logActivity(
        user.uid,
        "challenge_completed",
        co2Impact,
        15, // 15 points per mission
        `Completed mission: ${mission.title}`
      )
    }
  }

  const generateNewMissions = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setMissions([
        ...missions,
        { id: Date.now(), title: "Unplug idle electronics today", impact: "1.2 kg CO2 saved", completed: false, category: "Energy" }
      ])
      setIsGenerating(false)
    }, 1500)
  }

  const completedCount = missions.filter(m => m.completed).length
  const progress = Math.round((completedCount / missions.length) * 100)

  return (
    <div className="flex-1 p-6 lg:p-8 bg-zinc-50 dark:bg-black/20 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full mb-4">
            <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">AI Climate Coach</h1>
          <p className="text-lg text-muted-foreground">
            Your personalized AI coach designed to give you daily, actionable missions to reduce your footprint.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-none shadow-lg">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Flame className="w-16 h-16 text-yellow-100 mb-4" />
                <h2 className="text-2xl font-bold mb-1">3 Day Streak!</h2>
                <p className="text-yellow-100 mb-6">You're on fire. Keep completing missions to level up.</p>
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs font-medium text-yellow-100">400 XP to next level</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{progress}%</div>
                <Progress value={progress} className="h-2 mb-2 [&>div]:bg-yellow-500" />
                <p className="text-sm text-muted-foreground">{completedCount} of {missions.length} missions completed</p>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Active Missions</h3>
              <Button variant="outline" size="sm" onClick={generateNewMissions} disabled={isGenerating}>
                {isGenerating ? "Consulting AI..." : "Get New Missions"}
              </Button>
            </div>

            <motion.div layout className="space-y-4">
              {missions.map((mission) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={mission.id}
                >
                  <Card className={`transition-all duration-300 ${mission.completed ? 'bg-slate-50 dark:bg-slate-900/50 border-transparent opacity-75' : 'border-l-4 border-l-yellow-500 shadow-md'}`}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-start">
                        <button onClick={() => toggleMission(mission.id)} className="mt-1 mr-4 shrink-0 transition-transform hover:scale-110">
                          {mission.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                          )}
                        </button>
                        <div>
                          <p className={`font-semibold text-lg ${mission.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {mission.title}
                          </p>
                          <div className="flex items-center mt-2 space-x-3">
                            <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300">
                              {mission.category}
                            </span>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                              <Leaf className="w-3 h-3 mr-1" /> {mission.impact}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        {mission.completed && <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  )
}

