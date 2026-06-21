import { motion } from 'framer-motion'

export default function QueryProgress({ progress }) {
  const stages = [
    { id: 'querying', label: 'Querying openFDA', icon: '🔄' },
    { id: 'signals', label: 'Calculating signals', icon: '📊' },
    { id: 'similar', label: 'Finding similar cases', icon: '👥' },
    { id: 'narrative', label: 'Generating summaries', icon: '📋' },
    { id: 'note', label: 'Finalizing report', icon: '✍️' },
    { id: 'complete', label: 'Complete', icon: '✅' },
  ]

  const currentIndex = stages.findIndex(s => s.id === progress.stage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card-dark rounded-xl shadow-lg p-8 mb-8 border border-teal-deep/30"
    >
      <h3 className="text-xl font-serif font-light text-text-off-white mb-8">Analyzing Data...</h3>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="flex-shrink-0 w-8 h-8">
              {index < currentIndex && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 rounded-full bg-teal-deep flex items-center justify-center text-text-off-white font-bold"
                >
                  ✓
                </motion.div>
              )}
              {index === currentIndex && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 rounded-full border-3 border-teal-deep border-t-transparent flex items-center justify-center"
                />
              )}
              {index > currentIndex && (
                <div className="w-8 h-8 rounded-full border-2 border-text-warm-gray/30 flex items-center justify-center text-text-warm-gray">
                  •
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className={`font-semibold ${
                index <= currentIndex ? 'text-text-off-white' : 'text-text-warm-gray/60'
              }`}>
                {stage.label}
              </p>
            </div>

            <div className="text-2xl">{stage.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <motion.div
        className="mt-8 bg-text-warm-gray/10 rounded-full h-2 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-teal-deep to-gold-muted"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentIndex + 1) / stages.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </motion.div>
  )
}
