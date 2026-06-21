"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Upload, Image as ImageIcon, Leaf, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/firebase/AuthContext"
import { logActivity } from "@/lib/firebase/firestore"


export default function CarbonLensPage() {
  const [imagePreview, setImagePreview] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target?.result)
      setResult(null) // Reset previous result
    }
    reader.readAsDataURL(file)
  }

  const { user } = useAuth()

  const analyzeImage = async () => {
    if (!imagePreview) return
    
    setIsAnalyzing(true)
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/gemini/vision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imagePreview })
      })
      
      const data = await response.json()
      setResult(data)

      if (user) {
        // Calculate points based on rating
        const pointsMap = { 'A': 10, 'B': 5, 'C': 0, 'D': -5, 'F': -10 };
        const rating = data.sustainabilityRating?.toUpperCase() || 'C';
        const points = pointsMap[rating] || 0;
        
        // Log activity
        await logActivity(
          user.uid,
          "lens_analysis",
          0, // Can't accurately parse string easily without LLM, keeping 0 for CO2 impact for now
          points,
          `Analyzed: ${data.detectedObjects?.join(", ")}`
        );
      }
    } catch (error) {
      console.error("Error analyzing image:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRatingColor = (rating) => {
    switch(rating.toUpperCase()) {
      case 'A': return 'text-green-500 bg-green-500/10'
      case 'B': return 'text-blue-500 bg-blue-500/10'
      case 'C': return 'text-yellow-500 bg-yellow-500/10'
      case 'D': return 'text-orange-500 bg-orange-500/10'
      case 'F': return 'text-red-500 bg-red-500/10'
      default: return 'text-slate-500 bg-slate-500/10'
    }
  }

  const getRatingProgress = (rating) => {
    switch(rating.toUpperCase()) {
      case 'A': return 90
      case 'B': return 75
      case 'C': return 50
      case 'D': return 25
      case 'F': return 10
      default: return 0
    }
  }

  return (
    <div className="flex-1 p-6 lg:p-8 bg-zinc-50 dark:bg-black/20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900 p-2 rounded-full mb-4">
            <ImageIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Carbon Lens</h1>
          <p className="text-muted-foreground">
            Upload a photo of food, products, or vehicles to instantly analyze their carbon footprint using AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Uploader Section */}
          <Card className="border-dashed border-2 shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div 
                className="flex flex-col items-center justify-center min-h-[300px] text-center"
                onClick={() => !isAnalyzing && fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  disabled={isAnalyzing}
                />
                
                <AnimatePresence mode="wait">
                  {imagePreview ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full relative rounded-xl overflow-hidden shadow-md"
                    >
                      <Image src={imagePreview} alt="Preview" width={400} height={400} className="w-full h-auto object-cover max-h-[400px]" />
                      {!isAnalyzing && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                          <p className="text-white font-medium flex items-center"><Upload className="mr-2 h-4 w-4" /> Change Image</p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center cursor-pointer hover:text-primary transition-colors"
                    >
                      <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <Upload className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="font-medium text-lg">Click to Upload</p>
                      <p className="text-sm text-muted-foreground mt-1">JPEG, PNG or WebP up to 5MB</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {imagePreview && (
                <div className="mt-6 flex justify-center">
                  <Button 
                    size="lg" 
                    className="w-full shadow-lg shadow-green-500/20"
                    onClick={(e) => { e.stopPropagation(); analyzeImage(); }}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="h-5 w-5 mr-2 border-t-2 border-r-2 border-white rounded-full animate-spin" />
                        Analyzing via Gemini...
                      </>
                    ) : (
                      <>
                        <Leaf className="mr-2 h-5 w-5" /> Analyze Impact
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="h-full">
            <AnimatePresence mode="wait">
              {isAnalyzing && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full"
                >
                  <Card className="h-full bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="relative w-24 h-24 mb-6">
                      <div className="absolute inset-0 rounded-full border-t-4 border-green-500 animate-spin opacity-80"></div>
                      <div className="absolute inset-2 rounded-full border-r-4 border-blue-500 animate-spin opacity-60" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                      <Leaf className="absolute inset-0 m-auto h-8 w-8 text-green-600 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-medium animate-pulse text-slate-700 dark:text-slate-300">Extracting materials...</h3>
                    <p className="text-muted-foreground text-sm mt-2">Consulting sustainability database</p>
                  </Card>
                </motion.div>
              )}

              {result && !isAnalyzing && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <Card className="overflow-hidden border-green-100 dark:border-green-900/50 shadow-xl">
                    <div className="bg-gradient-to-r from-green-500 to-teal-600 h-2 w-full"></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl">Impact Report</CardTitle>
                          <CardDescription>Estimated via Gemini Vision</CardDescription>
                        </div>
                        <div className={`text-3xl font-black px-4 py-2 rounded-xl ${getRatingColor(result.sustainabilityRating)}`}>
                          {result.sustainabilityRating}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      
                      {/* Impact Meter */}
                      <div>
                        <div className="flex justify-between text-sm font-medium mb-2">
                          <span className="text-muted-foreground">Sustainability Score</span>
                          <span>{getRatingProgress(result.sustainabilityRating)} / 100</span>
                        </div>
                        <Progress value={getRatingProgress(result.sustainabilityRating)} className="h-2" />
                      </div>

                      {/* Carbon Estimate */}
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Estimated Carbon Impact</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
                          {result.estimatedCarbonImpact}
                        </p>
                      </div>

                      {/* Detected Objects */}
                      <div>
                        <p className="text-sm font-medium mb-3">Detected Components</p>
                        <div className="flex flex-wrap gap-2">
                          {result.detectedObjects.map((obj, i) => (
                            <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              {obj}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <p className="text-sm font-medium mb-3 flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Greener Alternatives
                        </p>
                        <ul className="space-y-3">
                          {result.recommendations.map((rec, i) => (
                            <motion.li 
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 + 0.3 }}
                              className="flex items-start text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-slate-700 dark:text-slate-300"
                            >
                              <ArrowRight className="w-4 h-4 mr-2 mt-0.5 text-green-600 shrink-0" />
                              {rec}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {!isAnalyzing && !result && (
                <div className="h-full flex items-center justify-center p-8 text-center text-muted-foreground border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
                  <div>
                    <Leaf className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                    <p>Upload an image and hit Analyze to see the magic of AI.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

