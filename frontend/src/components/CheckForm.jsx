import { useState } from 'react'
import { motion } from 'framer-motion'

export default function CheckForm({ onSubmit, disabled }) {
  const [formData, setFormData] = useState({
    drugA: '',
    drugB: '',
    patientAge: '',
    patientSex: '',
    patientConditions: '',
    patientCurrentMeds: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.drugA || !formData.drugB) {
      alert('Please enter both drugs')
      return
    }
    onSubmit(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-lg p-8 mb-8"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-8">Enter Patient & Drug Information</h2>

      {/* Drug inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Drug A *
          </label>
          <input
            type="text"
            name="drugA"
            value={formData.drugA}
            onChange={handleChange}
            placeholder="e.g., Warfarin"
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none transition"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Drug B *
          </label>
          <input
            type="text"
            name="drugB"
            value={formData.drugB}
            onChange={handleChange}
            placeholder="e.g., Ibuprofen"
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none transition"
          />
        </motion.div>
      </div>

      {/* Patient demographics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Age (optional)
          </label>
          <input
            type="number"
            name="patientAge"
            value={formData.patientAge}
            onChange={handleChange}
            placeholder="e.g., 67"
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none transition"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Sex (optional)
          </label>
          <select
            name="patientSex"
            value={formData.patientSex}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none transition"
          >
            <option value="">Select...</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Conditions (optional)
          </label>
          <input
            type="text"
            name="patientConditions"
            value={formData.patientConditions}
            onChange={handleChange}
            placeholder="e.g., Atrial fibrillation, HTN"
            disabled={disabled}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none transition"
          />
        </motion.div>
      </div>

      {/* Current medications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="mb-8"
      >
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Current Medications (optional)
        </label>
        <input
          type="text"
          name="patientCurrentMeds"
          value={formData.patientCurrentMeds}
          onChange={handleChange}
          placeholder="e.g., Warfarin, Metoprolol, Lisinopril"
          disabled={disabled}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-primary focus:outline-none transition"
        />
      </motion.div>

      {/* Submit button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        type="submit"
        disabled={disabled}
        className={`w-full py-4 text-lg font-bold rounded-lg transition ${
          disabled
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transform hover:-translate-y-1'
        }`}
      >
        {disabled ? '⏳ Checking...' : '🔍 Check Combination'}
      </motion.button>

      <p className="text-xs text-slate-500 mt-4 text-center">
        * Required fields • Data is queried live from FDA FAERS database
      </p>
    </motion.form>
  )
}
