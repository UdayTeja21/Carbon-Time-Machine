"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Fingerprint, Download, FileText, Car, Coffee, ShoppingBag, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function CarbonDNAPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [report, setReport] = useState(false)

  const generateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setReport(true)
    }, 2000)
  }

  const exportPDF = () => {
    window.print()
  }

  return (
    <div className="flex-1 p-6 lg:p-8 bg-zinc-50 dark:bg-black/20 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center max-w-2xl mx-auto print:hidden">
          <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full mb-4">
            <Fingerprint className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Carbon DNA Report</h1>
          <p className="text-lg text-muted-foreground">
            Generate your unique sustainability fingerprint and detailed AI report across four core lifestyle categories.
          </p>
        </div>

        {!report ? (
          <Card className="max-w-md mx-auto text-center py-12 print:hidden">
            <CardContent>
              {isGenerating ? (
                <div className="flex flex-col items-center">
                  <Fingerprint className="h-24 w-24 text-purple-500 animate-pulse mb-6 opacity-80" />
                  <h3 className="text-xl font-bold mb-2">Sequencing your Carbon DNA...</h3>
                  <Progress value={66} className="h-2 w-full max-w-[200px] mb-2 [&>div]:bg-purple-600" />
                  <p className="text-sm text-muted-foreground">Analyzing your historical data</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Fingerprint className="h-24 w-24 text-slate-300 dark:text-slate-700 mb-6" />
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white w-full" onClick={generateReport}>
                    <FileText className="mr-2 h-5 w-5" /> Generate My Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 shadow-2xl rounded-2xl overflow-hidden print:shadow-none print:m-0"
            id="dna-report"
          >
            {/* Report Header */}
            <div className="bg-slate-900 text-white p-8 sm:p-12 relative overflow-hidden print:bg-white print:text-black print:border-b print:p-6">
              <div className="absolute top-[-50px] right-[-50px] opacity-10 print:hidden">
                <Fingerprint className="w-64 h-64" />
              </div>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h1 className="text-3xl sm:text-5xl font-black mb-2">Carbon DNA</h1>
                  <p className="text-slate-400 print:text-slate-600 text-lg">Official Sustainability Report</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-slate-400 print:text-slate-600 mb-1">ID: CDNA-8842-A9X</p>
                  <p className="font-mono text-sm text-slate-400 print:text-slate-600">DATE: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-12 print:p-6 grid md:grid-cols-2 gap-12">
              
              {/* Visual Fingerprint */}
              <div className="flex flex-col items-center justify-center border-r border-slate-100 dark:border-slate-800 print:border-none pr-0 md:pr-12">
                <h3 className="text-lg font-bold mb-8 uppercase tracking-widest text-slate-400">Your Signature</h3>
                <div className="relative w-64 h-64 rounded-full flex items-center justify-center mb-8">
                  <div className="absolute inset-0 rounded-full border-[12px] border-red-500/80 opacity-80" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
                  <div className="absolute inset-4 rounded-full border-[10px] border-green-500/80 opacity-80" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
                  <div className="absolute inset-8 rounded-full border-[8px] border-blue-500/80 opacity-80" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}></div>
                  <div className="absolute inset-12 rounded-full border-[6px] border-yellow-500/80 opacity-80" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}></div>
                  <Fingerprint className="w-24 h-24 text-slate-800 dark:text-slate-200" />
                </div>
                <p className="text-center text-sm text-muted-foreground italic">
                  This visual representation is unique to your lifestyle distribution across Transport, Food, Shopping, and Energy.
                </p>
              </div>

              {/* DNA Breakdown */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center"><Car className="w-5 h-5 mr-2 text-red-500"/> Transport DNA</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">High Commute / Low Transit (35% of total)</p>
                  <Progress value={35} className="h-2 [&>div]:bg-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center"><Coffee className="w-5 h-5 mr-2 text-green-500"/> Food DNA</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Flexitarian / Medium Impact (20% of total)</p>
                  <Progress value={20} className="h-2 [&>div]:bg-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center"><ShoppingBag className="w-5 h-5 mr-2 text-blue-500"/> Shopping DNA</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">High E-commerce / Fast Fashion (30% of total)</p>
                  <Progress value={30} className="h-2 [&>div]:bg-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center"><Zap className="w-5 h-5 mr-2 text-yellow-500"/> Energy DNA</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Efficient Home / Renewable Mix (15% of total)</p>
                  <Progress value={15} className="h-2 [&>div]:bg-yellow-500" />
                </div>
              </div>
            </div>
            
            {/* AI Summary */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 sm:p-12 print:p-6 border-t border-slate-100 dark:border-slate-800 print:border-t-2">
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">AI Executive Summary</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                Based on your behavioral sequencing, your Carbon DNA exhibits strong tendencies toward high-emission transportation and frequent e-commerce consumption. However, your Energy DNA is exceptionally resilient, showing proactive adoption of renewables. 
                <br/><br/>
                <strong>Primary Mutation Target:</strong> Shifting 20% of your current shopping habits to local, sustainable vendors will fundamentally alter your fingerprint toward a net-positive trajectory.
              </p>

              <div className="flex justify-end print:hidden">
                <Button onClick={exportPDF} className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

