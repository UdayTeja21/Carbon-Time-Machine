"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Globe, Droplet, TreePine, CloudLightning, ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export default function FutureSimulatorPage() {
  const [meatConsumption, setMeatConsumption] = useState([50])
  const [transitUsage, setTransitUsage] = useState([20])
  const [renewableEnergy, setRenewableEnergy] = useState([10])

  // Simple simulation logic
  const carbonBase = 5000000 // Base for 1M people
  const waterBase = 1000000000 // Base for 1M people
  const treesBase = 20000000

  const carbonReduction = (100 - meatConsumption[0]) * 10000 + transitUsage[0] * 15000 + renewableEnergy[0] * 20000
  const waterReduction = (100 - meatConsumption[0]) * 5000000
  const treeReduction = carbonReduction / 100

  const finalCarbon = Math.max(1000000, carbonBase - carbonReduction)
  const finalWater = Math.max(100000000, waterBase - waterReduction)
  const finalTrees = Math.max(1000000, treesBase - treeReduction)

  return (
    <div className="flex-1 p-6 lg:p-8 bg-zinc-50 dark:bg-black/20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-teal-100 dark:bg-teal-900/50 p-2 rounded-full mb-4">
            <Globe className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Future Earth Simulator</h1>
          <p className="text-lg text-muted-foreground">
            What would happen if 1 million people lived exactly like you? Adjust your lifestyle to see the global impact.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-teal-100 dark:border-teal-900/50 shadow-md">
              <CardHeader>
                <CardTitle>Lifestyle Parameters</CardTitle>
                <CardDescription>Drag sliders to simulate changes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Meat Consumption</label>
                    <span className="text-sm font-bold text-teal-600">{meatConsumption}%</span>
                  </div>
                  <Slider 
                    value={meatConsumption} 
                    onValueChange={setMeatConsumption} 
                    max={100} 
                    step={5} 
                    className="[&_[role=slider]]:bg-teal-600"
                  />
                  <p className="text-xs text-muted-foreground">100% = Every meal, 0% = Vegan</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Public Transit Usage</label>
                    <span className="text-sm font-bold text-teal-600">{transitUsage}%</span>
                  </div>
                  <Slider 
                    value={transitUsage} 
                    onValueChange={setTransitUsage} 
                    max={100} 
                    step={5} 
                    className="[&_[role=slider]]:bg-teal-600"
                  />
                  <p className="text-xs text-muted-foreground">100% = Never drive alone</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Renewable Energy</label>
                    <span className="text-sm font-bold text-teal-600">{renewableEnergy}%</span>
                  </div>
                  <Slider 
                    value={renewableEnergy} 
                    onValueChange={setRenewableEnergy} 
                    max={100} 
                    step={5} 
                    className="[&_[role=slider]]:bg-teal-600"
                  />
                  <p className="text-xs text-muted-foreground">Solar/Wind power ratio in home</p>
                </div>

              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <CloudLightning className="mr-2 text-yellow-400" /> AI Insight
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Decreasing meat consumption to below 30% has the single largest impact on reducing global water scarcity in this simulation.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              If 1 Million People Lived Like You
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              
              <motion.div 
                key={finalCarbon}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden border-orange-200 dark:border-orange-900/30">
                  <div className="h-2 w-full bg-gradient-to-r from-orange-400 to-red-500"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center text-slate-700 dark:text-slate-200">
                      <CloudLightning className="w-5 h-5 mr-2 text-orange-500" /> Carbon Emitted
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-black text-slate-900 dark:text-white">
                      {(finalCarbon / 1000000).toFixed(1)}M <span className="text-lg font-normal text-muted-foreground">tons/yr</span>
                    </div>
                    <p className="text-sm mt-3 text-slate-500 dark:text-slate-400">
                      Equivalent to {(finalCarbon / 4600).toFixed(0)} round-trip flights from NY to London.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div 
                key={finalWater}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="overflow-hidden border-blue-200 dark:border-blue-900/30">
                  <div className="h-2 w-full bg-gradient-to-r from-blue-400 to-cyan-500"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center text-slate-700 dark:text-slate-200">
                      <Droplet className="w-5 h-5 mr-2 text-blue-500" /> Water Consumed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-black text-slate-900 dark:text-white">
                      {(finalWater / 1000000000).toFixed(1)}B <span className="text-lg font-normal text-muted-foreground">liters/yr</span>
                    </div>
                    <p className="text-sm mt-3 text-slate-500 dark:text-slate-400">
                      Enough to fill {(finalWater / 2500000).toFixed(0)} Olympic-sized swimming pools.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div 
                key={finalTrees}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="sm:col-span-2"
              >
                <Card className="overflow-hidden border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10">
                  <div className="h-2 w-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center text-slate-700 dark:text-slate-200">
                      <TreePine className="w-5 h-5 mr-2 text-green-600" /> Trees Required to Offset
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-5xl font-black text-green-700 dark:text-green-400">
                          {(finalTrees / 1000000).toFixed(1)}M
                        </div>
                        <p className="text-sm mt-2 text-slate-600 dark:text-slate-400 font-medium">
                          Mature trees needed over 10 years
                        </p>
                      </div>
                      <div className="flex space-x-1 opacity-50">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <TreePine key={i} className="w-8 h-8 text-green-600" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

