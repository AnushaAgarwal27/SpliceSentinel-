import { motion } from 'framer-motion'

export default function SimilarCases({ cases }) {
  if (!cases || cases.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <h3 className="text-2xl font-bold text-slate-800 mb-8">
        👥 Similar Patient Cases from FAERS
      </h3>

      <p className="text-slate-600 mb-6">
        Real patients with similar profiles who took this drug combination:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((caseData, index) => (
          <motion.div
            key={caseData.safetyreportid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
            className="border-2 border-slate-200 rounded-lg p-6 hover:border-primary hover:shadow-md transition"
          >
            {/* Similarity Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-600">Similarity Match</span>
                <span className={`text-2xl font-bold ${
                  caseData.similarity_score >= 70 ? 'text-success' :
                  caseData.similarity_score >= 50 ? 'text-warning' :
                  'text-slate-600'
                }`}>
                  {caseData.similarity_score}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${caseData.similarity_score}%` }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                />
              </div>
            </div>

            {/* Why Similar */}
            <div className="mb-4 p-3 bg-slate-50 rounded">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Why similar:</span> {caseData.reason}
              </p>
            </div>

            {/* What Happened */}
            <div className="mb-3">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">
                What Happened
              </p>
              <p className="text-lg font-semibold text-danger">
                {caseData.reaction}
              </p>
            </div>

            {/* Timing */}
            {caseData.days_to_onset && (
              <div className="mb-3 text-sm text-slate-600">
                ⏱️ Onset: Day {caseData.days_to_onset}
              </div>
            )}

            {/* Report ID */}
            <div className="pt-3 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                Report ID: <code className="bg-slate-100 px-2 py-1 rounded">{caseData.safetyreportid}</code>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
