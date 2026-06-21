import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import './App.css'

import CheckForm from './components/CheckForm'
import QueryProgress from './components/QueryProgress'
import SignalResults from './components/SignalResults'
import SimilarCases from './components/SimilarCases'
import NarrativeSummary from './components/NarrativeSummary'
import ClinicalNote from './components/ClinicalNote'

export default function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState({})

  const handleCheck = async (formData) => {
    setLoading(true)
    setError(null)
    setResults(null)
    setProgress({})

    try {
      // Show query progress
      setProgress({ stage: 'querying' })

      const response = await axios.post('http://localhost:8000/api/check-combination', {
        drug_a: formData.drugA,
        drug_b: formData.drugB,
        patient_age: formData.patientAge ? parseInt(formData.patientAge) : null,
        patient_sex: formData.patientSex || null,
        patient_conditions: formData.patientConditions || null,
        patient_current_meds: formData.patientCurrentMeds || null,
      })

      // Simulate progressive reveal (in real app, backend would stream)
      setProgress({ stage: 'signals' })
      await new Promise(r => setTimeout(r, 800))

      setProgress({ stage: 'similar' })
      await new Promise(r => setTimeout(r, 800))

      setProgress({ stage: 'narrative' })
      await new Promise(r => setTimeout(r, 800))

      setProgress({ stage: 'note' })
      await new Promise(r => setTimeout(r, 400))

      setResults(response.data)
      setProgress({ stage: 'complete' })
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Failed to check combination. Make sure backend is running on port 8000.'
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white py-12 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-2">
              🔬 Drug Interaction Checker
            </h1>
            <p className="text-lg opacity-90">
              Real FDA adverse event data to flag dangerous drug combinations
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Form Section */}
        {!results && (
          <CheckForm onSubmit={handleCheck} disabled={loading} />
        )}

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-danger/10 border border-danger text-danger rounded-lg"
            >
              ❌ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progressive Results */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <QueryProgress progress={progress} />
            </motion.div>
          )}

          {results && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Signal Results */}
              <SignalResults results={results} />

              {/* Similar Cases */}
              {results.similar_cases && results.similar_cases.length > 0 && (
                <SimilarCases cases={results.similar_cases} />
              )}

              {/* Narrative Summary */}
              {results.narrative_summary && (
                <NarrativeSummary summary={results.narrative_summary} />
              )}

              {/* Clinical Note */}
              {results.clinical_note && (
                <ClinicalNote note={results.clinical_note} />
              )}

              {/* Back Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={() => {
                  setResults(null)
                  setProgress({})
                }}
                className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition"
              >
                ← Check Another Combination
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-8 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center text-sm">
          <p>Data source: FDA FAERS via openFDA API • This tool does not provide medical advice</p>
          <p className="mt-2 text-xs opacity-70">For hackathon demo purposes</p>
        </div>
      </footer>
    </div>
  )
}
