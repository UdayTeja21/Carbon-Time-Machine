"use client"

import { useState } from "react"
import { Trophy, Medal, Award, Star, Flame, ChevronUp, Users, Building, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const leaderboardData = [
  { id: 1, name: "Sarah J.", avatar: "/avatars/01.png", score: 9850, saved: "1.2t CO2", trend: "up", challenges: 42, rank: 1 },
  { id: 2, name: "Michael T.", avatar: "/avatars/02.png", score: 9240, saved: "1.1t CO2", trend: "up", challenges: 38, rank: 2 },
  { id: 3, name: "Emma W.", avatar: "/avatars/03.png", score: 8900, saved: "0.9t CO2", trend: "down", challenges: 35, rank: 3 },
  { id: 4, name: "David L.", avatar: "/avatars/04.png", score: 8100, saved: "0.8t CO2", trend: "up", challenges: 31, rank: 4 },
  { id: 5, name: "You (Eco Warrior)", avatar: "", score: 7850, saved: "0.75t CO2", trend: "up", challenges: 28, rank: 5, isUser: true },
  { id: 6, name: "Priya M.", avatar: "/avatars/05.png", score: 7600, saved: "0.7t CO2", trend: "down", challenges: 25, rank: 6 },
]

export default function LeaderboardPage() {
  return (
    <div className="flex-1 p-6 lg:p-8 bg-zinc-50 dark:bg-black/20 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full mb-4">
            <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Global Leaderboard</h1>
          <p className="text-lg text-muted-foreground">
            See how your sustainability efforts stack up against the community. Compete in challenges to climb the ranks.
          </p>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="users"><Users className="w-4 h-4 mr-2"/> Users</TabsTrigger>
              <TabsTrigger value="cities"><Building className="w-4 h-4 mr-2"/> Cities</TabsTrigger>
              <TabsTrigger value="colleges"><GraduationCap className="w-4 h-4 mr-2"/> Colleges</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="users">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Top 3 Podium */}
              <div className="md:col-span-3 flex justify-center items-end h-64 gap-4 sm:gap-8 pb-8 border-b border-border/50">
                
                {/* 2nd Place */}
                <div className="flex flex-col items-center translate-y-8">
                  <div className="relative mb-4">
                    <Avatar className="h-16 w-16 border-4 border-slate-300">
                      <AvatarImage src={leaderboardData[1].avatar} />
                      <AvatarFallback>MT</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-3 -right-3 bg-slate-300 rounded-full p-1"><Medal className="w-5 h-5 text-white" /></div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-t-xl w-24 sm:w-32 flex flex-col items-center justify-end h-24 border border-b-0 border-slate-200 dark:border-slate-700 shadow-md">
                    <p className="font-bold text-sm truncate w-full text-center">{leaderboardData[1].name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{leaderboardData[1].score}</p>
                    <p className="text-3xl font-black text-slate-300 mt-2">2</p>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-20 w-20 border-4 border-amber-400">
                      <AvatarImage src={leaderboardData[0].avatar} />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-3 -right-3 bg-amber-400 rounded-full p-1"><Trophy className="w-6 h-6 text-white" /></div>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                      <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-t from-amber-200 to-amber-50 dark:from-amber-900/50 dark:to-slate-800 p-4 rounded-t-xl w-28 sm:w-36 flex flex-col items-center justify-end h-32 border border-b-0 border-amber-200 dark:border-amber-700/50 shadow-xl">
                    <p className="font-bold text-sm truncate w-full text-center">{leaderboardData[0].name}</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-mono font-bold">{leaderboardData[0].score}</p>
                    <p className="text-4xl font-black text-amber-500 mt-2">1</p>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center translate-y-12">
                  <div className="relative mb-4">
                    <Avatar className="h-14 w-14 border-4 border-amber-700/50">
                      <AvatarImage src={leaderboardData[2].avatar} />
                      <AvatarFallback>EW</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-3 -right-3 bg-amber-700/50 rounded-full p-1"><Award className="w-4 h-4 text-white" /></div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-t-xl w-24 sm:w-32 flex flex-col items-center justify-end h-20 border border-b-0 border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="font-bold text-sm truncate w-full text-center">{leaderboardData[2].name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{leaderboardData[2].score}</p>
                    <p className="text-2xl font-black text-amber-800/50 mt-2">3</p>
                  </div>
                </div>

              </div>
            </div>

            {/* List */}
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {leaderboardData.map((user) => (
                    <div 
                      key={user.id} 
                      className={`flex items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${user.isUser ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}`}
                    >
                      <div className="w-8 font-bold text-slate-400 text-center mr-4">{user.rank}</div>
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.substring(0,2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <p className={`font-semibold ${user.isUser ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                            {user.name}
                          </p>
                          {user.isUser && <Badge variant="secondary" className="ml-2 text-xs">You</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                          <Star className="w-3 h-3 mr-1 text-amber-500" /> {user.challenges} challenges completed
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="font-mono font-bold text-lg flex items-center">
                          {user.score}
                          {user.trend === 'up' ? 
                            <ChevronUp className="w-4 h-4 ml-1 text-green-500" /> : 
                            <ChevronUp className="w-4 h-4 ml-1 text-red-500 rotate-180" />
                          }
                        </div>
                        <div className="text-xs text-green-600 font-medium">Saved: {user.saved}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cities">
            <Card className="p-12 text-center text-muted-foreground border-dashed">
              <Building className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>City rankings will be available after 1000 active users.</p>
            </Card>
          </TabsContent>
          <TabsContent value="colleges">
            <Card className="p-12 text-center text-muted-foreground border-dashed">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>College rankings require verified student emails.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

