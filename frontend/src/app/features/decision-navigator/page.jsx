"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Compass, Send, CheckCircle2, XCircle, Leaf, Clock, DollarSign, CloudLightning } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/firebase/AuthContext"
import { logActivity } from "@/lib/firebase/firestore"





export default function DecisionNavigatorPage() {
  const [question, setQuestion] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const { user } = useAuth()

  const askGemini = async (e) => {
    if (e) e.preventDefault()
    if (!question.trim()) return

    setIsAnalyzing(true)
    setResult(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/gemini/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      const data = await response.json()
      setResult(data)

      if (user) {
        // Assume asking a decision is a good habit, giving 5 points
        await logActivity(
          user.uid,
          "decision_made",
          0, // CO2 impact is comparative here, so hard to put an absolute number without picking an option
          5,
          `Asked Navigator: ${question}`
        )
      }
    } catch (error) {
      console.error("Error fetching decision:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score) => {
    switch(score.toUpperCase()) {
      case 'A': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'B': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      case 'C': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'D': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800'
      case 'F': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
    }
  }

  return (
    <div className="flex-1 p-6 lg:p-8 bg-zinc-50 dark:bg-black/20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full mb-4">
            <Compass className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Green Decision Navigator</h1>
          <p className="text-lg text-muted-foreground">
            Ask Gemini to compare choices and find the most sustainable path before you act.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={askGemini} className="relative flex items-center">
            <Input 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Should I travel to the office by car or metro today?"
              className="pr-14 h-14 text-lg rounded-full shadow-sm border-slate-300 focus-visible:ring-emerald-500"
              disabled={isAnalyzing}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-2 rounded-full bg-emerald-600 hover:bg-emerald-700 h-10 w-10 text-white shadow-md transition-transform hover:scale-105"
              disabled={isAnalyzing || !question.trim()}
            >
              {isAnalyzing ? <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin"/> : <Send className="h-4 w-4" />}
            </Button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setQuestion("Should I buy local groceries or order from a delivery app?")}>Local vs Delivery App</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setQuestion("Should I upgrade my phone this year or wait?")}>Upgrade Phone?</Badge>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isAnalyzing && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-t-4 border-emerald-500 animate-spin opacity-80"></div>
                <Compass className="absolute inset-0 m-auto h-8 w-8 text-emerald-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-medium animate-pulse">Navigating choices...</h3>
              <p className="text-muted-foreground mt-2">Evaluating carbon impact, cost, and time constraints.</p>
            </motion.div>
          )}

          {result && !isAnalyzing && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {result.options.map((option, idx) => (
                  <Card key={idx} className={`border-2 ${idx === 1 ? 'border-emerald-400 dark:border-emerald-600 shadow-emerald-500/10' : 'border-slate-200 dark:border-slate-800'} relative overflow-hidden`}>
                    {idx === 1 && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Eco Choice</div>}
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <CardTitle>{option.title}</CardTitle>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${getScoreColor(option.sustainabilityScore)}`}>
                          {option.sustainabilityScore}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-100 dark:divide-slate-800">
                        <div className="px-2">
                          <CloudLightning className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Impact</p>
                          <p className="font-semibold text-sm">{option.carbonImpact}</p>
                        </div>
                        <div className="px-2">
                          <DollarSign className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Cost</p>
                          <p className="font-semibold text-sm">{option.cost}</p>
                        </div>
                        <div className="px-2">
                          <Clock className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Time</p>
                          <p className="font-semibold text-sm">{option.time}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          <p className="text-sm font-semibold flex items-center mb-2 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Pros
                          </p>
                          <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                            {option.pros.map((p, i) => <li key={i} className="flex items-start"><span className="mr-2">•</span>{p}</li>)}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-semibold flex items-center mb-2 text-red-600 dark:text-red-400">
                            <XCircle className="w-4 h-4 mr-1" /> Cons
                          </p>
                          <ul className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                            {option.cons.map((c, i) => <li key={i} className="flex items-start"><span className="mr-2">•</span>{c}</li>)}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/50">
                <CardContent className="p-6 flex items-start">
                  <div className="bg-emerald-100 dark:bg-emerald-800 p-3 rounded-xl mr-4 shrink-0">
                    <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-1">Gemini Verdict</h4>
                    <p className="text-emerald-800 dark:text-emerald-200 leading-relaxed">
                      {result.verdict}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

