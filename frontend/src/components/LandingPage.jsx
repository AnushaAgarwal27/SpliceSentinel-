import { useState } from 'react'
import { motion } from 'framer-motion'
import FileUploadPage from '@/components/FileUploadPage'

export default function LandingPage({ onGetStarted }) {
  const [showUpload, setShowUpload] = useState(false)

  if (showUpload) {
    return (
      <FileUploadPage
        onExtractedData={onGetStarted}
        onBack={() => setShowUpload(false)}
      />
    )
  }

  return (
    <div className="bg-black w-full h-screen flex flex-col items-center justify-center relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold text-white mb-4">🧬 Splice Sentinel</h1>
        <p className="text-xl text-slate-300">
          Real FDA adverse event data to flag dangerous drug combinations
        </p>
      </motion.div>

      {/* Get Started Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowUpload(true)}
        className="inline-flex items-center gap-3 rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl hover:bg-indigo-700 hover:shadow-3xl transition-all"
      >
        Get Started →
      </motion.button>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-slate-400 text-center"
        >
          <p className="text-sm mb-2">Scroll to learn more</p>
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}
