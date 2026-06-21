import { motion } from 'framer-motion'

export default function SignalResults({ results }) {
  const hasSignals = results.signals && results.signals.length > 0
  const isLowConfidence = results.combo_total < 10

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className={`rounded-xl shadow-lg p-8 ${
        hasSignals
          ? 'bg-gradient-to-br from-danger/5 to-danger/10 border-2 border-danger'
          : 'bg-gradient-to-br from-success/5 to-success/10 border-2 border-success'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className={`text-3xl font-bold mb-2 ${
            hasSignals ? 'text-danger' : 'text-success'
          }`}>
            {hasSignals ? '⚠️ ELEVATED SIGNAL DETECTED' : '✓ NO ELEVATED SIGNAL'}
          </h2>
          <p className="text-slate-600">
            {results.drug_a} + {results.drug_b}
          </p>
        </div>
      </div>

      {/* Confidence & Data Volume */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`mb-8 p-4 rounded-lg ${
          results.confidence === 'HIGH'
            ? 'bg-success/20 border border-success/50'
            : results.confidence === 'MODERATE'
            ? 'bg-warning/20 border border-warning/50'
            : 'bg-danger/20 border border-danger/50'
        }`}
      >
        <p className="font-semibold text-slate-800 mb-1">
          📊 Data Confidence: <span className={
            results.confidence === 'HIGH' ? 'text-success' :
            results.confidence === 'MODERATE' ? 'text-warning' :
            'text-danger'
          }>{results.confidence}</span>
        </p>
        <p className="text-sm text-slate-600">
          {results.confidence_message}
        </p>
      </motion.div>

      {/* Signals Table */}
      {hasSignals && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4">Flagged Reactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Reaction</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Count</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Rate</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">
                    PRR vs {results.drug_a}
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">
                    PRR vs {results.drug_b}
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.signals.slice(0, 10).map((signal, index) => (
                  <motion.tr
                    key={signal.reaction}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + index * 0.05 }}
                    className="border-b border-slate-200 hover:bg-white/50 transition"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {signal.reaction}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-700">
                      {signal.combo_count}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-700">
                      {signal.rate_in_combo}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${
                        signal.prr_vs_drug_a >= 5 ? 'text-danger' : 'text-warning'
                      }`}>
                        {signal.prr_vs_drug_a}×
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${
                        signal.prr_vs_drug_b >= 5 ? 'text-danger' : 'text-warning'
                      }`}>
                        {signal.prr_vs_drug_b}×
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {results.signals.length > 10 && (
            <p className="text-sm text-slate-500 mt-4">
              Showing 10 of {results.signals.length} flagged reactions
            </p>
          )}
        </motion.div>
      )}

      {/* Low Confidence Warning */}
      {isLowConfidence && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-danger/20 border border-danger/50 rounded-lg"
        >
          <p className="text-danger font-semibold text-sm">
            ⚠️ LOW DATA VOLUME: Only {results.combo_total} reports found.
            Results are unreliable and may be due to chance.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
