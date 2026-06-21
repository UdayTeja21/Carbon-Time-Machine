"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Map, MapPin, Navigation, Car, Bus, Train, Leaf, Clock, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const mockRoutes = [
  {
    id: "fastest",
    type: "Fastest Route",
    icon: <Car className="w-5 h-5 text-red-500" />,
    time: "24 mins",
    cost: "$4.50 (Gas)",
    emissions: "3.2 kg CO2",
    details: "Via I-95 N. Heavy traffic expected.",
    isSustainable: false,
    color: "red"
  },
  {
    id: "sustainable",
    type: "Lowest Carbon",
    icon: <Bus className="w-5 h-5 text-green-500" />,
    time: "42 mins",
    cost: "$2.00",
    emissions: "0.8 kg CO2",
    details: "Take Bus 14, then a short 5-minute walk.",
    isSustainable: true,
    color: "green"
  },
  {
    id: "public",
    type: "Public Transit",
    icon: <Train className="w-5 h-5 text-blue-500" />,
    time: "35 mins",
    cost: "$2.50",
    emissions: "1.1 kg CO2",
    details: "Blue Line Metro directly to downtown.",
    isSustainable: true,
    color: "blue"
  }
]

export default function RoutePlannerPage() {
  const [start, setStart] = useState("")
  const [destination, setDestination] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [routes, setRoutes] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (!start || !destination) return

    setIsCalculating(true)
    setRoutes(null)

    // Simulate Google Maps Directions API call
    setTimeout(() => {
      setRoutes(mockRoutes)
      setIsCalculating(false)
    }, 1500)
  }

  return (
    <div className="flex-1 p-6 lg:p-8 bg-zinc-50 dark:bg-black/20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 p-2 rounded-full mb-4">
            <Map className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Green Route Planner</h1>
          <p className="text-muted-foreground">
            Find the most sustainable way to reach your destination. We compare time, cost, and carbon emissions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Where to?</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="space-y-2 relative">
                    <Label>Start Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        placeholder="Current Location" 
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 relative">
                    <Label>Destination</Label>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g. Central Park" 
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isCalculating || !start || !destination}>
                    {isCalculating ? "Calculating Routes..." : "Find Routes"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <AnimatePresence>
              {routes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-lg">Available Routes</h3>
                  {routes.map((route, idx) => (
                    <Card key={route.id} className={`overflow-hidden border-2 transition-all cursor-pointer hover:shadow-md ${route.isSustainable ? 'border-green-400 dark:border-green-600' : 'border-transparent'}`}>
                      {route.isSustainable && idx === 1 && (
                        <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 text-center">
                          ✨ AI Recommended Eco-Choice
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center font-bold">
                            {route.icon} <span className="ml-2">{route.type}</span>
                          </div>
                          <span className={`text-sm font-bold ${route.isSustainable ? 'text-green-600' : 'text-red-500'}`}>
                            {route.emissions}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                          <div className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {route.time}</div>
                          <div className="flex items-center"><Banknote className="w-4 h-4 mr-1"/> {route.cost}</div>
                        </div>
                        <p className="text-xs text-muted-foreground">{route.details}</p>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mock Map Area */}
          <div className="lg:col-span-2">
            <Card className="h-full min-h-[500px] border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=New+York,NY&zoom=13&size=800x600&maptype=roadmap&key=mock')] bg-cover bg-center mix-blend-luminosity"></div>
              
              {!routes && !isCalculating && (
                <div className="relative z-10 text-center">
                  <Map className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                  <p className="text-muted-foreground">Enter your destination to see map and routes.</p>
                </div>
              )}

              {isCalculating && (
                <div className="relative z-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-medium animate-pulse">Querying Google Maps API...</p>
                </div>
              )}

              {routes && !isCalculating && (
                <div className="relative z-10 text-center bg-white/80 dark:bg-black/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 max-w-sm">
                  <Leaf className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Interactive Map Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    (Requires valid Google Maps API Key to render interactive canvas. Showing mock UI routing.)
                  </p>
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}

