"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, Globe, Zap, Image as ImageIcon } from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: <ImageIcon className="w-8 h-8 text-green-500" />,
      title: "Carbon Lens",
      description: "Instantly analyze the carbon footprint of products, food, and vehicles with AI vision."
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-500" />,
      title: "Future Simulator",
      description: "Simulate your lifestyle changes and see their long-term impact on the planet."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "AI Climate Coach",
      description: "Get personalized, dynamic challenges to lower your carbon footprint every day."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-slate-950 dark:to-slate-900 overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-400/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-teal-400/10 blur-[150px]" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full mb-8 shadow-sm">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-medium">Your AI Sustainability Copilot</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8">
            See the Future.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-500">
              Change the World.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12">
            Understand, predict, and reduce your carbon footprint with AI-powered simulations, image analysis, and intelligent decision support.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-green-500/25 hover:scale-105 transition-transform">
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/features/carbon-lens">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform">
                Try Carbon Lens
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full"
        >
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 text-left"
            >
              <div className="mb-6 inline-block p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}

