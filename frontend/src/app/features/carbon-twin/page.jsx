"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Car, Coffee, ShoppingBag, Zap, ArrowRight, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const steps = [
  { id: 'transport', title: 'Transportation', icon: <Car className="w-5 h-5" /> },
  { id: 'food', title: 'Diet & Food', icon: <Coffee className="w-5 h-5" /> },
  { id: 'shopping', title: 'Shopping', icon: <ShoppingBag className="w-5 h-5" /> },
  { id: 'energy', title: 'Energy', icon: <Zap className="w-5 h-5" /> }
]

const mockProjection = [
  { time: 'Now', emissions: 1200 },
  { time: '6 Months', emissions: 1050 },
  { time: '1 Year', emissions: 850 },
  { time: '5 Years', emissions: 400 },
]

export default function CarbonTwinPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [twinCreated, setTwinCreated] = useState(false)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1)
    } else {
      createTwin()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1)
    }
  }

  const createTwin = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setTwinCreated(true)
    }, 2500)
  }

  return (
    <div className="flex-1 p-6 lg:p-8 bg-zinc-50 dark:bg-black/20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full mb-4">
            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Personal Carbon Twin</h1>
          <p className="text-muted-foreground">
            We'll create an AI digital twin to model your lifestyle and predict your future environmental impact.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!twinCreated ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              {!isGenerating ? (
                <Card className="border-indigo-100 dark:border-indigo-900/50 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      {steps.map((step, idx) => (
                        <div key={step.id} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            idx <= currentStep ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {step.icon}
                          </div>
                          <div className="text-xs font-medium mt-2 hidden sm:block text-slate-500">{step.title}</div>
                        </div>
                      ))}
                    </div>
                    <CardTitle>{steps[currentStep].title} Habits</CardTitle>
                    <CardDescription>Tell us about your daily {steps[currentStep].title.toLowerCase()} routine.</CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-[200px]">
                    {currentStep === 0 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>How do you primarily commute?</Label>
                          <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option>Car (Gasoline)</option>
                            <option>Car (Electric)</option>
                            <option>Public Transit</option>
                            <option>Bicycle / Walking</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Average daily distance (km)</Label>
                          <Input type="number" placeholder="e.g. 15" />
                        </div>
                      </div>
                    )}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>What best describes your diet?</Label>
                          <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option>Omnivore (Meat daily)</option>
                            <option>Flexitarian (Meat 2-3x/week)</option>
                            <option>Vegetarian</option>
                            <option>Vegan</option>
                          </select>
                        </div>
                      </div>
                    )}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Online shopping frequency</Label>
                          <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option>Multiple times a week</option>
                            <option>Once a week</option>
                            <option>A few times a month</option>
                            <option>Rarely</option>
                          </select>
                        </div>
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Monthly Energy Bill ($)</Label>
                          <Input type="number" placeholder="e.g. 80" />
                        </div>
                        <div className="space-y-2">
                          <Label>Home heating type</Label>
                          <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option>Natural Gas</option>
                            <option>Electric</option>
                            <option>Oil</option>
                            <option>Renewable / Solar</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>Back</Button>
                    <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700">
                      {currentStep === steps.length - 1 ? 'Generate Twin' : 'Next'}
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="flex flex-col items-center justify-center min-h-[400px]">
                  <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin opacity-80"></div>
                    <div className="absolute inset-4 rounded-full border-b-4 border-purple-500 animate-spin opacity-60" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                    <User className="absolute inset-0 m-auto h-12 w-12 text-indigo-600 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold animate-pulse text-indigo-900 dark:text-indigo-100 mb-2">Simulating Your Twin</h3>
                  <p className="text-muted-foreground text-center max-w-sm">Running millions of scenarios to calculate your 5-year future impact trajectory...</p>
                </Card>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid md:grid-cols-3 gap-8">
                
                <Card className="md:col-span-1 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900 border-indigo-100 dark:border-indigo-900/50">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                      <User className="w-16 h-16 text-indigo-600 dark:text-indigo-400 relative z-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Eco Warrior Alpha</h2>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-6">Digital Twin Active</p>
                    
                    <div className="w-full space-y-4">
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border shadow-sm">
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Current Baseline</p>
                        <p className="text-2xl font-black text-slate-800 dark:text-white">1,200 kg</p>
                        <p className="text-xs text-slate-500 mt-1">CO2e per year</p>
                      </div>
                      
                      <div className="bg-indigo-600 p-4 rounded-xl shadow-lg shadow-indigo-600/20 text-white">
                        <p className="text-xs text-indigo-200 mb-1 uppercase tracking-wider font-semibold">5-Year Target</p>
                        <p className="text-2xl font-black">400 kg</p>
                        <p className="text-xs text-indigo-100 mt-1">-66% reduction possible</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-8">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center"><Activity className="w-5 h-5 mr-2 text-indigo-500"/> Future Projection</CardTitle>
                      <CardDescription>If you follow your AI-generated sustainability plan.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockProjection} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ borderRadius: '8px' }} />
                          <Line type="monotone" dataKey="emissions" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
                    <CardHeader>
                      <CardTitle>AI Future Insight</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-lg leading-relaxed text-slate-300 italic">
                        "Your twin shows that by simply changing your commute to public transit twice a week and adopting a flexitarian diet, you will save enough emissions over the next 5 years to offset the equivalent of 3 round-trip trans-Atlantic flights."
                      </p>
                      <div className="mt-6 flex gap-4">
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">Accept Plan</Button>
                        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Adjust Habits</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

