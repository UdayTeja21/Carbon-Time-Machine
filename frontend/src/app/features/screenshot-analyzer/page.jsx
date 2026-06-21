"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Upload, ShoppingCart, Leaf, CheckCircle2, ArrowRight, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"



export default function ScreenshotAnalyzerPage() {
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
      setResult(null)
    }
    reader.readAsDataURL(file)
  }

  const analyzeImage = async () => {
    if (!imagePreview) return
    
    setIsAnalyzing(true)
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/gemini/screenshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imagePreview })
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error analyzing screenshot:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="flex-1 p-6 lg:p-8 bg-zinc-50 dark:bg-black/20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 p-2 rounded-full mb-4">
            <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Screenshot Analyzer</h1>
          <p className="text-muted-foreground">
            Upload a screenshot of your shopping cart, food delivery, or travel booking to estimate its carbon footprint before you checkout.
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
                    className="w-full shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 text-white"
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
                        <ShoppingCart className="mr-2 h-5 w-5" /> Analyze Cart
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
                      <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin opacity-80"></div>
                      <div className="absolute inset-2 rounded-full border-r-4 border-teal-500 animate-spin opacity-60" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                      <ShoppingCart className="absolute inset-0 m-auto h-8 w-8 text-blue-600 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-medium animate-pulse text-slate-700 dark:text-slate-300">Extracting products...</h3>
                    <p className="text-muted-foreground text-sm mt-2">Calculating shipping logistics and lifecycle emissions</p>
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
                  <Card className="overflow-hidden border-blue-100 dark:border-blue-900/50 shadow-xl">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 w-full"></div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl">Checkout Impact</CardTitle>
                      <CardDescription>Estimated via Gemini Vision</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      
                      {/* Carbon Estimate */}
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Estimated Carbon Footprint</p>
                        <p className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center">
                          {result.carbonScore}
                        </p>
                      </div>

                      {/* Detected Products */}
                      <div>
                        <p className="text-sm font-medium mb-3 flex items-center">
                          <Package className="w-4 h-4 mr-2" /> Items Detected
                        </p>
                        <div className="flex flex-col gap-2">
                          {result.products.map((item, i) => (
                            <div key={i} className="flex items-center text-sm bg-blue-50/50 dark:bg-blue-900/20 px-3 py-2 rounded-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 shrink-0"></span>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <p className="text-sm font-medium mb-3 flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Smart Alternatives
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
                    <ShoppingCart className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                    <p>Upload a screenshot of your cart before you buy.</p>
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

