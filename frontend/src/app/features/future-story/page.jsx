"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, BookOpen, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function FutureStoryPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [storyData, setStoryData] = useState(null)
  const [displayedText, setDisplayedText] = useState("")
  
  const generateStory = async () => {
    setIsGenerating(true)
    setStoryData(null)
    setDisplayedText("")

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/gemini/story`, { method: 'POST' })
      const data = await response.json()
      setStoryData(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Typewriter effect
  useEffect(() => {
    if (storyData && storyData.story) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(storyData.story.substring(0, i))
        i++
        if (i > storyData.story.length) clearInterval(interval)
      }, 30)
      return () => clearInterval(interval)
    }
  }, [storyData])

  return (
    <div className="flex-1 p-6 lg:p-8 bg-zinc-50 dark:bg-black/20 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        
        <AnimatePresence mode="wait">
          {!storyData && !isGenerating && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="inline-flex items-center space-x-2 bg-pink-100 dark:bg-pink-900/50 p-4 rounded-full mb-8">
                <BookOpen className="h-10 w-10 text-pink-600 dark:text-pink-400" />
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">Your Future Story</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                Let Gemini peer into the future and write a personalized narrative of how your sustainable actions today changed the world of tomorrow.
              </p>
              <Button size="lg" onClick={generateStory} className="h-14 px-8 text-lg rounded-full bg-pink-600 hover:bg-pink-700 text-white shadow-xl shadow-pink-500/20">
                <Sparkles className="mr-2 h-5 w-5" /> Generate My 2035 Story
              </Button>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 rounded-full border-t-4 border-pink-500 animate-spin opacity-80" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-4 rounded-full border-r-4 border-indigo-500 animate-spin opacity-60" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                <Clock className="absolute inset-0 m-auto h-10 w-10 text-pink-600 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">
                Traveling to 2035...
              </h3>
            </motion.div>
          )}

          {storyData && !isGenerating && (
            <motion.div
              key="story"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600 rounded-full blur-[120px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20 -ml-20 -mb-20 pointer-events-none"></div>
                
                <CardContent className="p-10 sm:p-16 relative z-10">
                  <div className="flex items-center space-x-4 mb-8 opacity-80">
                    <Sparkles className="w-6 h-6 text-pink-400" />
                    <span className="font-mono text-pink-400 tracking-widest uppercase">Year {storyData.year}</span>
                  </div>
                  
                  <blockquote className="text-2xl sm:text-4xl font-serif leading-relaxed sm:leading-loose text-indigo-50">
                    "{displayedText}"
                    {displayedText.length < storyData.story.length && (
                      <span className="inline-block w-3 h-8 bg-pink-500 ml-1 animate-pulse"></span>
                    )}
                  </blockquote>

                  {displayedText.length === storyData.story.length && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: 1 }}
                      className="mt-12 flex justify-end"
                    >
                      <Button variant="outline" onClick={() => setStoryData(null)} className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/50 hover:text-white rounded-full">
                        Return to Present <ChevronRight className="ml-2 w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

