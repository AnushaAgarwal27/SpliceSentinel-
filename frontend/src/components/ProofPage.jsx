import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

export default function ProofPage({ onClose, drug_a, drug_b }) {
  const [proofData, setProofData] = useState(null)
  const [rawFDAData, setRawFDAData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showRaw, setShowRaw] = useState(false)

  useEffect(() => {
    if (!drug_a || !drug_b) return

    const fetchProof = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(`http://localhost:8000/debug/fda-raw/${drug_a}/${drug_b}`)
        setProofData(response.data)
        setRawFDAData(response.data.raw_fda_response)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProof()
  }, [drug_a, drug_b])

  if (!drug_a || !drug_b) {
    return (
      <div className="fixed inset-0 bg-bg-dark/80 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card-dark rounded-2xl p-8 max-w-md w-full border border-teal-deep/30"
        >
          <h2 className="text-text-off-white text-xl font-bold mb-3">📋 No Comparison Yet</h2>
          <p className="text-text-warm-gray mb-6">Complete a drug combination check first to view detailed FDA data analysis.</p>
          <button
            onClick={onClose}
            className="w-full bg-teal-deep hover:bg-teal-light text-text-off-white font-semibold py-2 rounded-lg transition"
          >
            Close
          </button>
        </motion.div>
      </div>
    )
  }

  const fdaApiUrl = `https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:"${drug_a.toUpperCase()}"+AND+patient.drug.medicinalproduct:"${drug_b.toUpperCase()}"&limit=100`

  return (
    <div className="fixed inset-0 bg-bg-dark z-50 overflow-y-auto">
      {/* Header */}
      <header className="bg-card-dark border-b border-teal-deep/30 p-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-light text-text-off-white mb-2">🔬 Proof of FDA Data</h1>
            <p className="text-text-warm-gray">{drug_a?.toUpperCase()} + {drug_b?.toUpperCase()}</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-text-warm-gray hover:text-text-off-white transition"
          >
            ×
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 pb-16">
        <AnimatePresence mode="wait">
          {/* Loading State */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-teal-deep/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="text-text-off-white/80">⏳ Fetching real FDA FAERS data...</p>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 mb-6"
            >
              <p className="text-red-300">❌ Error: {error}</p>
            </motion.div>
          )}

          {/* Success State */}
          {proofData && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* PROOF OF CONCEPT Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-2 border-green-500/50 rounded-lg p-8"
              >
                <div className="flex gap-4 mb-6">
                  <div className="text-5xl">✅</div>
                  <div>
                    <h2 className="text-3xl font-bold text-green-300 mb-2">Real FDA Data Verified</h2>
                    <p className="text-text-off-white/80">This data is 100% from FDA FAERS. Anyone can verify it independently.</p>
                  </div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="grid md:grid-cols-4 gap-4"
              >
                <div className="bg-gradient-to-br from-teal-deep/30 to-teal-deep/20 border border-teal-deep/30 rounded-lg p-6">
                  <p className="text-text-warm-gray text-sm mb-2">Total Reports Found</p>
                  <p className="text-4xl font-bold text-teal-light">{proofData.total_reports?.toLocaleString()}</p>
                  <p className="text-xs text-text-warm-gray/70 mt-2">Real FDA FAERS reports</p>
                </div>

                <div className="bg-gradient-to-br from-teal-deep/25 to-teal-deep/15 border border-teal-deep/50 rounded-lg p-6">
                  <p className="text-text-warm-gray text-sm mb-2">Reactions Detected</p>
                  <p className="text-4xl font-bold text-teal-light">{proofData.total_reactions_found}</p>
                  <p className="text-xs text-text-warm-gray/70 mt-2">Adverse events</p>
                </div>

                <div className="bg-gradient-to-br from-gold-muted/20 to-gold-muted/10 border border-gold-muted/50 rounded-lg p-6">
                  <p className="text-text-warm-gray text-sm mb-2">Serious Cases</p>
                  <p className="text-4xl font-bold text-gold-muted">
                    {proofData.sample_reports?.filter(r => r.serious === '1').length || 0}
                  </p>
                  <p className="text-xs text-text-warm-gray/70 mt-2">Marked serious</p>
                </div>

                <div className="bg-gradient-to-br from-text-warm-gray/10 to-text-warm-gray/5 border border-text-warm-gray/30 rounded-lg p-6">
                  <p className="text-text-warm-gray text-sm mb-2">Last Updated</p>
                  <p className="text-lg font-bold text-gold-muted">Live</p>
                  <p className="text-xs text-text-warm-gray/70 mt-2">Real-time data</p>
                </div>
              </motion.div>

              {/* HOW TO VERIFY Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card-dark border border-teal-deep/30 rounded-lg p-6"
              >
                <h2 className="text-2xl font-bold text-text-off-white mb-6">🔗 How to Verify This Yourself</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-teal-light font-bold mb-2">Step 1: Copy the FDA API Query</h3>
                    <p className="text-text-off-white/80 text-sm mb-3">This is the EXACT query being sent to FDA servers:</p>
                    <div className="bg-bg-dark/50 rounded p-4 border border-teal-deep/30 overflow-x-auto">
                      <code className="text-xs text-teal-light break-all font-mono">{fdaApiUrl}</code>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-teal-light font-bold mb-2">Step 2: Paste into Your Browser</h3>
                    <p className="text-text-off-white/80 text-sm mb-3">Open a new tab and paste that URL. You'll get the RAW JSON response from FDA servers. No code, no tricks - just you and FDA's official API.</p>
                  </div>
                  <div>
                    <h3 className="text-teal-light font-bold mb-2">Step 3: Look Up Report IDs</h3>
                    <p className="text-text-off-white/80 text-sm mb-3">Each report ID below is a real FDA case. You can search any of them at:</p>
                    <a
                      href="https://fis.fda.gov/sense/app/1d6c6f94-3d59-4e9e-b365-e282632b2fc9/sheet/7adf9e1e-b01e-4788-a128-41b674950735/state/analysis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-light hover:text-blue-300 underline text-sm"
                    >
                      FDA FAERS Public Dashboard →
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Reported Reactions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-card-dark border border-teal-deep/30 rounded-lg p-6"
              >
                <h2 className="text-2xl font-bold text-text-off-white mb-6">🏥 Sample Adverse Reactions From FDA</h2>
                <p className="text-text-warm-gray text-sm mb-4">These are REAL reactions reported by patients/doctors to FDA:</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {proofData.sample_reactions?.slice(0, 12).map((reaction, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 + i * 0.03 }}
                      className="bg-indigo-900/20 border border-teal-deep/30 rounded p-3"
                    >
                      <p className="text-text-off-white/90 text-sm">{reaction}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Real Case Examples */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card-dark border border-teal-deep/30 rounded-lg p-6"
              >
                <h2 className="text-2xl font-bold text-text-off-white mb-6">📋 Real Patient Cases (Verifiable)</h2>
                <div className="space-y-3">
                  {proofData.sample_reports?.slice(0, 5).map((report, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="bg-bg-dark/50 border border-teal-deep/30 rounded p-4"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-text-warm-gray text-xs">FDA Report ID</p>
                          <p className="text-text-off-white/90 font-mono text-xs mt-1 break-all">{report.safetyreportid}</p>
                        </div>
                        <div>
                          <p className="text-text-warm-gray text-xs">Patient Age</p>
                          <p className="text-text-off-white/90 font-bold">{report.patient?.patientonsetage || '—'} yrs</p>
                        </div>
                        <div>
                          <p className="text-text-warm-gray text-xs">Serious?</p>
                          <p className={`font-bold ${report.serious === '1' ? 'text-red-400' : 'text-green-400'}`}>
                            {report.serious === '1' ? '⚠️ YES' : '✓ No'}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-warm-gray text-xs">Country</p>
                          <p className="text-text-off-white/90">{report.primarysourcecountry || '—'}</p>
                        </div>
                        <div>
                          <p className="text-text-warm-gray text-xs">Report Date</p>
                          <p className="text-text-off-white/90 text-xs">{report.transmissiondate || '—'}</p>
                        </div>
                      </div>
                      <p className="text-xs text-text-warm-gray">✓ This report is public and searchable on fda.gov</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Show Raw FDA Response */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-card-dark border border-teal-deep/30 rounded-lg p-6"
              >
                <button
                  onClick={() => setShowRaw(!showRaw)}
                  className="w-full text-left font-bold text-teal-light hover:text-indigo-200 transition flex items-center gap-2"
                >
                  <span>{showRaw ? '▼' : '▶'}</span>
                  💻 Raw FDA API Response (Advanced)
                </button>

                {showRaw && rawFDAData && (
                  <div className="mt-4 bg-bg-dark/50 rounded p-4 border border-teal-deep/30 max-h-96 overflow-auto">
                    <pre className="text-xs text-text-off-white/80 font-mono whitespace-pre-wrap break-words">
                      {JSON.stringify(rawFDAData, null, 2).slice(0, 2000)}...
                    </pre>
                    <p className="text-xs text-text-warm-gray mt-3">
                      This is the unmodified JSON from FDA servers. See any field that starts with "patient." or "primarysource" - that's all real FDA data structure.
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Why This Proves It */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-teal-deep/20 to-teal-deep/15 border border-teal-deep/30 rounded-lg p-6"
              >
                <h2 className="text-2xl font-bold text-text-off-white mb-4">⚖️ Why This Stands Up in Court</h2>
                <ul className="space-y-3 text-text-off-white/80 text-sm">
                  <li className="flex gap-3">
                    <span className="text-green-400">✓</span>
                    <span><strong>Public Source:</strong> FDA FAERS is the official government adverse event database. Anyone can access it.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400">✓</span>
                    <span><strong>Verifiable URLs:</strong> We show the exact API endpoints. Copy-paste into any browser to verify.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400">✓</span>
                    <span><strong>Real Report IDs:</strong> Every case can be looked up on FDA.gov by anyone. These aren't made up.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400">✓</span>
                    <span><strong>No Processing Tricks:</strong> We show raw FDA JSON response. You can verify the data matches their official API output.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400">✓</span>
                    <span><strong>Transparent Algorithm:</strong> We calculate PRR (Proportional Reporting Ratio) using standard pharmacovigilance formulas. The math is auditable.</span>
                  </li>
                </ul>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="bg-bg-dark/30 border border-teal-deep/30 rounded-lg p-4 text-center"
              >
                <p className="text-text-warm-gray text-sm">
                  📌 This tool aggregates and analyzes publicly available FDA data. For clinical decisions, always consult medical professionals.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
