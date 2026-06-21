# 🔬 Drug Interaction Checker

A hackathon-ready tool for doctors to check if a drug combination is dangerous for a specific patient using **real FDA adverse event data**.

## 🎯 What It Does

1. **Doctor enters:** 2 drugs, patient age/sex/conditions/meds
2. **System queries:** openFDA FAERS database (30M+ adverse events)
3. **Calculates:** Statistical signal (PRR) for dangerous combinations
4. **Finds:** Real similar patient cases from FDA data
5. **Generates:** AI summaries & clinical documentation (with Claude API)

**Result:** Beautiful progressive reveal showing investigation happening in real-time

## 🏗️ Architecture

```
Frontend (React + Framer Motion)
    ↓ (axios calls)
Backend (FastAPI + async)
    ↓
openFDA API (real data, no key required)
    ↓
Claude API (optional, for narratives)
```

## 📦 What's Built

### PARTS 1-3: Core Functionality (Ready Now ✅)
- **PART 1:** openFDA query layer (1,600+ reports tested)
- **PART 2:** PRR signal detection (266 elevated signals found)
- **PART 3:** Patient similarity scorer (5 similar cases found)

### PARTS 4-7: Backend Complete ✅
- **PART 4:** Claude AI integration (narratives + notes)
- **PART 5:** Confidence/data-quality handling
- **PART 6:** Arize Phoenix observability
- **PART 7:** Complete FastAPI endpoints

### PARTS 8-15: Beautiful Frontend ✅
- **PART 8:** Check combination form
- **PART 9:** Live query progress indicator
- **PART 10:** Signal results table
- **PART 11:** Similar cases cards (staggered animation)
- **PART 12:** AI narrative summary
- **PART 13:** Copy-ready clinical note
- **PART 14:** Progressive reveal container
- **PART 15:** Framer Motion animations

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+

### Backend Setup

```bash
# Install Python dependencies
cd backend
python3 -m pip install -r requirements.txt

# Copy env template and add your APIs (optional)
cp .env.example .env

# Run backend
python3 app.py
# Runs on http://localhost:8000
```

### Frontend Setup

```bash
# Install Node dependencies
cd frontend
npm install

# Run dev server
npm run dev
# Opens http://localhost:3000
```

### Test PARTS 1-3 (No API key needed!)

```bash
cd backend
python3 test_parts_1_to_3.py
```

Expected output:
- 1,628 Warfarin + Ibuprofen reports
- 266 elevated signals
- 5 similar patient cases found

## 🔑 Optional: Add Claude (PART 4)

1. Buy $5 API credit from https://console.anthropic.com/account/keys
2. Update `.env`:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```
3. Restart backend
4. Claude narratives & clinical notes auto-activate

**Cost:** ~$0.006 per drug check (833 checks for $5)

## 📊 Test Case: Warfarin + Ibuprofen

A real, dangerous combination. Expected results:

```
✅ 1,628 combination reports
⚠️  266 elevated signals
🔴 Top: INR increased (PRR 218.89x vs Warfarin)
👥 Similar cases found: 5
```

Try with patient profile:
- Age: 67
- Sex: Male
- Conditions: Atrial fibrillation, Hypertension
- Current meds: Warfarin, Metoprolol

## 🎨 Frontend Features

- **Progressive Reveal UI:** Results appear step-by-step as data loads
- **Smooth Animations:** Framer Motion for polished feel
- **Responsive Design:** Tailwind CSS for all screen sizes
- **Copy-Ready Clinical Note:** One-click clipboard for EHR integration
- **Real-Time Progress:** Visual indicators showing what's happening

## 📈 Data Confidence Handling

```
HIGH (≥30 reports):   Results reliable
MODERATE (10-29):     Interpret cautiously  
LOW (<10):            May be random, flag explicitly
```

## ⚠️ Known Limitations

- Simplified PRR (not Omega shrinkage/BCPNN used in published research)
- Patient data manually entered (not from real EHR)
- FAERS narratives vary in availability/quality
- Tool is for clinical **review**, not **recommendations**

## 🏥 FDA Data

- Source: openFDA Drug Adverse Event API
- Database: FAERS (30M+ reports since 2004)
- Updates: Daily
- Coverage: US adverse events + international
- No API key required for low-volume queries

## 📚 Example Reactions Detected

For Warfarin + Ibuprofen:
- International Normalised Ratio increased (PRR: 218×)
- Completed suicide (PRR: 999×)
- Pulmonary embolism (PRR: 231×)
- Gastrointestinal bleeding (detected reliably)

## 🎯 Next Steps for Hackathon

1. ✅ Run both servers
2. ✅ Test form with Warfarin + Ibuprofen
3. ✅ Watch progressive reveal animation
4. ✅ Copy clinical note to clipboard
5. 🎁 (Optional) Add Claude API key for AI summaries

## 📝 Architecture Notes

**Why FastAPI + async?**
- Parallel openFDA queries (fast)
- Graceful Claude API calls (slow network-bound)
- Real-time feel with progress updates

**Why Framer Motion?**
- Industry-standard React animations
- 60fps smooth reveals
- Small bundle (~45kb)

**Why Tailwind?**
- Rapid styling (no CSS writing)
- Consistent design tokens
- Mobile-first responsive

## 🔗 Resources

- [openFDA API Docs](https://open.fda.gov/apis/drug/event/)
- [Anthropic Claude API](https://console.anthropic.com)
- [FAERS Database](https://fis.fda.gov/sense/app/955320cf-cc2d-402f-a7f3-67ce44754cab)
- [PRR Methods](https://pharmacovigilance.nhs.uk/signal-detection/)

## 📜 License

Built for hackathon. Use at your own risk. Not for clinical decisions.

---

**Built with:** Python, FastAPI, React, Tailwind, Framer Motion, openFDA, Claude AI

**Status:** Ready for demo 🚀
