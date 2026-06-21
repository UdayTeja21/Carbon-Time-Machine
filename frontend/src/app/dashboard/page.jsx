"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/firebase/AuthContext"
import { getUserDashboardStats } from "@/lib/firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Leaf, Droplet, Zap, ArrowUpRight, ArrowDownRight, Lightbulb, Map } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import Link from "next/link"

const weeklyData = [
  { name: 'Mon', emissions: 12 },
  { name: 'Tue', emissions: 19 },
  { name: 'Wed', emissions: 15 },
  { name: 'Thu', emissions: 10 },
  { name: 'Fri', emissions: 22 },
  { name: 'Sat', emissions: 30 },
  { name: 'Sun', emissions: 25 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        setIsLoading(true)
        const userStats = await getUserDashboardStats(user.uid)
        setStats(userStats)
        setIsLoading(false)
      } else {
        setStats(null)
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [user])

  if (!mounted) return null

  return (
    <div className="flex-1 p-6 lg:p-8 bg-zinc-50 dark:bg-black/20">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.displayName || "Eco Warrior"}. Here's your impact so far.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link href="/features/carbon-lens">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Leaf className="w-4 h-4 mr-2" /> New Analysis
              </Button>
            </Link>
          </div>
        </div>

        <motion.div 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-slate-900 border-green-100 dark:border-green-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800 dark:text-green-400">Carbon Score</CardTitle>
                <Leaf className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {isLoading ? "..." : stats?.totalScore || 0} Points
                </div>
                <p className="text-xs text-green-600/80 dark:text-green-400/80 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Based on your impact
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impact Logged</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : (stats?.totalEmissions || 0)} kg
                </div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  Total CO2 saved / emitted
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Water Saved</CardTitle>
                <Droplet className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">450 L</div>
                <p className="text-xs text-blue-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +2.1% from last week
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
                <Zap className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : (stats?.activitiesCount || 0)}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  <span className="mt-1 inline-block">Activities tracked over last 30 days</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Emission Trends</CardTitle>
              <CardDescription>
                Your daily CO2 emissions over the past week.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.weeklyData || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888888'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888888'}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="emissions" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorEmissions)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>
                Personalized insights based on your recent activity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg h-fit mr-3">
                    <Map className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Switch Commute Route</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Taking the metro on Wednesdays instead of driving could save you 12kg of CO2 this month.
                    </p>
                  </div>
                </div>

                <div className="flex p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-lg h-fit mr-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Energy Spike Detected</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your home energy usage spiked yesterday. Consider adjusting your thermostat by 2 degrees.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/features/decision-navigator">
                  <Button variant="outline" className="w-full">
                    Ask Green Decision Navigator
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

