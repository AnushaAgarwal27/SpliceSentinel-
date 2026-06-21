import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { ClipboardList, Pill, Lock, Zap } from 'lucide-react'

const AnimatedBackground = () => {
  const gridDots = []
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      gridDots.push({ x: (i * 100) / 15, y: (j * 100) / 15 })
    }
  }

  return (
    <div className="fixed inset-0 bg-bg-dark overflow-hidden -z-10">
      <style>{`
        @keyframes drift-slow-1 {
          0%, 100% { transform: translate(0px, 0px); }
          25% { transform: translate(-20px, 15px); }
          50% { transform: translate(-10px, 25px); }
          75% { transform: translate(15px, 10px); }
        }
        @keyframes drift-slow-2 {
          0%, 100% { transform: translate(0px, 0px); }
          25% { transform: translate(20px, -15px); }
          50% { transform: translate(10px, -25px); }
          75% { transform: translate(-15px, -10px); }
        }
        @keyframes drift-slow-3 {
          0%, 100% { transform: translate(0px, 0px); }
          25% { transform: translate(-15px, -20px); }
          50% { transform: translate(10px, -15px); }
          75% { transform: translate(20px, 10px); }
        }
        @keyframes drift-slow-4 {
          0%, 100% { transform: translate(0px, 0px); }
          25% { transform: translate(15px, 20px); }
          50% { transform: translate(-10px, 15px); }
          75% { transform: translate(-20px, -10px); }
        }
        .glow-orb-1 { animation: drift-slow-1 18s ease-in-out infinite; }
        .glow-orb-2 { animation: drift-slow-2 20s ease-in-out infinite; }
        .glow-orb-3 { animation: drift-slow-3 17s ease-in-out infinite; }
        .glow-orb-4 { animation: drift-slow-4 19s ease-in-out infinite; }
      `}</style>

      {/* Grid of dots background */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.15, pointerEvents: 'none' }}
      >
        {gridDots.map((dot, idx) => (
          <circle
            key={idx}
            cx={`${dot.x}%`}
            cy={`${dot.y}%`}
            r="2"
            fill="rgba(34, 197, 94, 0.6)"
          />
        ))}
      </svg>

      {/* Glowing orbs - top left */}
      <div
        className="glow-orb-1 absolute top-20 left-20 w-96 h-96 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.08) 40%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Glowing orbs - top right */}
      <div
        className="glow-orb-2 absolute -top-20 -right-20 w-96 h-96 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.22) 0%, rgba(34, 197, 94, 0.06) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Glowing orbs - bottom left */}
      <div
        className="glow-orb-3 absolute -bottom-32 -left-32 w-96 h-96 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.05) 45%, transparent 75%)',
          filter: 'blur(65px)',
        }}
      />

      {/* Glowing orbs - bottom right */}
      <div
        className="glow-orb-4 absolute -bottom-20 -right-20 w-96 h-96 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.23) 0%, rgba(34, 197, 94, 0.07) 40%, transparent 70%)',
          filter: 'blur(55px)',
        }}
      />
    </div>
  )
}

export default function FileUploadPage({ onExtractedData, onBack, loading: parentLoading, results: parentResults }) {
  const [patientReport, setPatientReport] = useState(null)
  const [prescription, setPrescription] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({})
  const [dragActive, setDragActive] = useState(null)

  useEffect(() => {
    // Reset form completely when coming back to upload another combination
    if (parentResults === null && !parentLoading) {
      setExtractedData(null)
      setFormData({})
      setPatientReport(null)
      setPrescription(null)
      setEditMode(false)
      setError(null)
      setLoading(false)
    }
  }, [parentResults, parentLoading])

  const handleDrag = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(type)
    } else if (e.type === 'dragleave') {
      setDragActive(null)
    }
  }

  const handleDrop = (e, type) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(null)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file, type)
  }

  const processFile = (file, type) => {
    const allowed = ['application/pdf', 'text/plain', 'image/jpeg', 'image/png']
    if (!allowed.includes(file.type)) {
      setError('Only PDF, TXT, JPG, and PNG files allowed')
      return
    }
    if (type === 'report') setPatientReport(file)
    if (type === 'prescription') setPrescription(file)
    setError(null)
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) processFile(file, type)
  }

  const handleExtract = async () => {
    if (!patientReport || !prescription) {
      setError('Please upload both files')
      return
    }

    setLoading(true)

    try {
      const formDataObj = new FormData()
      formDataObj.append('patient_report', patientReport)
      formDataObj.append('prescription', prescription)

      const response = await axios.post('/api/extract-patient-data', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setExtractedData(response.data)
      setFormData(response.data.extracted_data)
      setEditMode(true)
    } catch (err) {
      console.error('Extraction error:', err)
      setError(err.response?.data?.detail || 'Failed to extract data from files')
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleConfirm = () => {
    onExtractedData({
      ...formData,
      raw_patient_report: extractedData.patient_report_text,
      raw_prescription: extractedData.prescription_text
    })
  }

  const FileUploadBox = ({ label, type, file, dragType }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onDragEnter={(e) => handleDrag(e, type)}
      onDragLeave={(e) => handleDrag(e, type)}
      onDragOver={(e) => handleDrag(e, type)}
      onDrop={(e) => handleDrop(e, type)}
      whileHover={{ y: -4 }}
      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
        dragActive === type
          ? 'border-gold-muted bg-gold-muted/10 shadow-lg shadow-gold-muted/20'
          : file
          ? 'border-gold-muted/60 bg-gold-muted/5 shadow-md shadow-gold-muted/10'
          : 'border-text-warm-gray/30 hover:border-gold-muted/50 hover:shadow-lg hover:shadow-gold-muted/15'
      }`}
    >
      <label className="cursor-pointer">
        <input
          type="file"
          accept=".pdf,.txt,.jpg,.png"
          onChange={(e) => handleFileChange(e, type)}
          className="hidden"
        />
        <div className="space-y-4">
          <div className="flex justify-center">
            {type === 'report' ? (
              <ClipboardList size={40} className="text-gold-muted" strokeWidth={1.5} />
            ) : (
              <Pill size={40} className="text-gold-muted" strokeWidth={1.5} />
            )}
          </div>
          <div>
            <p className="text-text-off-white font-semibold">{label}</p>
            <p className="text-text-warm-gray text-sm mt-1">
              {file ? file.name : 'Drag & drop or click to upload'}
            </p>
          </div>
          {!file && (
            <p className="text-xs text-text-warm-gray/60">PDF, TXT, JPG, PNG</p>
          )}
          {file && (
            <p className="text-xs text-gold-muted font-semibold">✓ Ready</p>
          )}
        </div>
      </label>
    </motion.div>
  )

  // Review Extracted Data Page
  if (extractedData && editMode) {
    return (
      <div className="bg-bg-dark w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card-dark backdrop-blur-sm border border-teal-deep/30 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-serif font-light text-text-off-white mb-2">✅ Review Extracted Data</h2>
            <p className="text-text-warm-gray mb-8 font-sans">Verify the information extracted from your documents. Edit if needed.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-text-warm-gray mb-2">Patient Age</label>
                <input
                  type="number"
                  value={formData.patient_age || ''}
                  onChange={(e) => handleFieldChange('patient_age', parseInt(e.target.value) || '')}
                  className="w-full bg-card-dark border border-text-warm-gray/20 rounded-lg px-4 py-2 text-text-off-white focus:border-teal-deep focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-warm-gray mb-2">Patient Sex</label>
                <select
                  value={formData.patient_sex || ''}
                  onChange={(e) => handleFieldChange('patient_sex', e.target.value)}
                  className="w-full bg-card-dark border border-text-warm-gray/20 rounded-lg px-4 py-2 text-text-off-white focus:border-teal-deep focus:outline-none"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-warm-gray mb-2">Medical Conditions</label>
                <textarea
                  value={formData.patient_conditions?.join(', ') || ''}
                  onChange={(e) => handleFieldChange('patient_conditions', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full bg-card-dark border border-text-warm-gray/20 rounded-lg px-4 py-2 text-text-off-white focus:border-teal-deep focus:outline-none min-h-20"
                  placeholder="e.g., Hypertension, Diabetes"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-warm-gray mb-2">Current Medications</label>
                <textarea
                  value={formData.patient_current_meds?.join(', ') || ''}
                  onChange={(e) => handleFieldChange('patient_current_meds', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full bg-card-dark border border-text-warm-gray/20 rounded-lg px-4 py-2 text-text-off-white focus:border-teal-deep focus:outline-none min-h-20"
                  placeholder="e.g., Aspirin, Lisinopril"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-warm-gray mb-2">Proposed Drug *</label>
                <input
                  type="text"
                  value={formData.proposed_drug || ''}
                  onChange={(e) => handleFieldChange('proposed_drug', e.target.value)}
                  className="w-full bg-card-dark border border-text-warm-gray/20 rounded-lg px-4 py-2 text-text-off-white focus:border-teal-deep focus:outline-none"
                  placeholder="e.g., Ibuprofen"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-warm-gray mb-2">Medical Indication</label>
                <input
                  type="text"
                  value={formData.illness_indication || ''}
                  onChange={(e) => handleFieldChange('illness_indication', e.target.value)}
                  className="w-full bg-card-dark border border-text-warm-gray/20 rounded-lg px-4 py-2 text-text-off-white focus:border-teal-deep focus:outline-none"
                  placeholder="e.g., Lower back pain"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                onClick={() => {
                  setExtractedData(null)
                  setFormData({})
                  setPatientReport(null)
                  setPrescription(null)
                  setEditMode(false)
                }}
                className="px-6 py-3 bg-card-dark hover:bg-card-dark/80 text-text-off-white font-semibold rounded-lg transition-colors border border-text-warm-gray/20"
              >
                ↺ Upload Different Files
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-3 bg-teal-deep hover:bg-teal-light text-white font-semibold rounded-lg transition-colors"
              >
                ✓ Check Drug Interactions
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-dark w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
      <AnimatedBackground />
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gold-muted hover:text-gold-muted/80 text-sm font-semibold mb-6"
          >
            ← Back to Home
          </button>
          <h1 className="text-5xl md:text-6xl font-serif font-light text-text-off-white mb-4">
            Upload Patient Data
          </h1>
          <p className="text-lg text-text-warm-gray font-sans">
            Upload medical records and prescription. Our AI will extract everything automatically.
          </p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-300 text-sm"
          >
            ❌ {error}
          </motion.div>
        )}

        {/* Upload Boxes */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <FileUploadBox
            label="Patient Medical Report"
            type="report"
            file={patientReport}
          />
          <FileUploadBox
            label="Prescription/Drug Information"
            type="prescription"
            file={prescription}
          />
        </div>

        {/* Extract Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={patientReport && prescription ? { scale: 1.01, opacity: 0.95 } : {}}
          whileTap={patientReport && prescription ? { scale: 0.99 } : {}}
          onClick={handleExtract}
          disabled={loading || !patientReport || !prescription}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
            loading || !patientReport || !prescription
              ? 'bg-text-warm-gray/20 text-text-warm-gray/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-gold-muted to-gold-muted hover:shadow-lg hover:shadow-gold-muted/20 text-bg-dark font-semibold'
          }`}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="animate-spin">⏳</span> Extracting Data...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <ClipboardList size={18} />
              Extract & Review Data
            </span>
          )}
        </motion.button>

        {/* Info Cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {/* Supported Files Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card-dark border border-gold-muted/30 rounded-xl p-6 text-center hover:border-gold-muted/60 transition-all"
          >
            <div className="flex justify-center mb-4">
              <ClipboardList size={32} className="text-gold-muted" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-text-off-white mb-2">Supported Files</h3>
            <p className="text-text-warm-gray text-sm">PDF, TXT, JPG, PNG</p>
          </motion.div>

          {/* Privacy Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-card-dark border border-gold-muted/30 rounded-xl p-6 text-center hover:border-gold-muted/60 transition-all"
          >
            <div className="flex justify-center mb-4">
              <Lock size={32} className="text-gold-muted" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-text-off-white mb-2">Privacy</h3>
            <p className="text-text-warm-gray text-sm">Your files are processed securely and not stored.</p>
          </motion.div>

          {/* AI Extraction Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card-dark border border-gold-muted/30 rounded-xl p-6 text-center hover:border-gold-muted/60 transition-all"
          >
            <div className="flex justify-center mb-4">
              <Zap size={32} className="text-gold-muted" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-text-off-white mb-2">AI Extraction</h3>
            <p className="text-text-warm-gray text-sm">Automatically extract patient demographics, medications, and conditions.</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
