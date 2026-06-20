# SpliceSentinel - FDA Drug Safety Interaction Checker

A tool that checks real FDA adverse event data to flag dangerous drug combinations and summarize what patients actually reported about them.

## The Problem

The FDA's FAERS database holds 30+ million adverse event reports since 2004. But the problem is nobody reads it properly. When a report mentions multiple drugs and multiple reactions, there's no systematic way to determine causality — and the rich patient narratives are almost never analyzed.

**Vioxx case**: Its cardiovascular risk was visible in public data starting around 2000, but the drug wasn't withdrawn until 2004. By then, an estimated 88,000 Americans had heart attacks.

## What This Does

1. **Doctor enters two drugs** (e.g., Warfarin + Ibuprofen)
2. **System queries openFDA** for reports of that combination vs each drug alone
3. **Calculates signal** using PRR (Proportional Reporting Ratio)
4. **Claude reads patient narratives** behind those reports, summarizes what people actually experienced
5. **Compares patient profile** to adverse-event cases for personalized risk assessment
6. **Generates a clinical note** the doctor can drop straight into their chart

## Quick Start

### Backend (Python)

```bash
# Install dependencies
pip install -r requirements.txt

# Set your Anthropic API key
export ANTHROPIC_API_KEY=your-key-here

# Run the server
python backend.py
```

Server runs on `http://localhost:8000`

### Frontend (React)

```bash
# Install dependencies
npm install

# Start dev server
npm start
```

Frontend runs on `http://localhost:3000`

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React
- **Data**: openFDA API (free, no key required)
- **LLM**: Claude Opus (Anthropic)
- **Observability**: Arize Phoenix (auto-tracing)
- **Storage**: SQLite

## API Endpoints

### `POST /check-combination`

```bash
curl -X POST "http://localhost:8000/check-combination?drug_a=Warfarin&drug_b=Ibuprofen&patient_age=72&patient_conditions=hypertension"
```

**Response:**
```json
{
  "drug_a": "Warfarin",
  "drug_b": "Ibuprofen",
  "risk_level": "elevated",
  "total_reports": 47,
  "elevated_reactions": {
    "Gastrointestinal bleeding": {
      "count": 12,
      "prr": 2.4,
      "rate_in_combo": 25.5
    }
  },
  "narrative_summary": "Patients reported bleeding complications...",
  "patient_similarity": "Similarity: HIGH because...",
  "generated_note": "Reviewed for interaction risk via FAERS..."
}
```

## Demo Flow

1. **Open narrative**: "In 2004, Vioxx was withdrawn. An estimated 88,000 Americans had heart attacks in the window while the warning signal was sitting in public data."
2. **Live test**: Warfarin + Ibuprofen
   - Shows the flag, report count
   - Claude's plain-language summary of what patients reported
   - Whether a demo patient resembles the at-risk group
   - Generated note ready to copy

## Sponsors

- **Anthropic**: Claude reads narratives and generates notes
- **Arize**: Logs and traces all FDA queries and Claude calls
- **Band**: Future orchestration layer (mentioned in pitch)

## Timeline

Built solo in 16 hours for a healthcare hackathon. Focuses on the core gap: reading patient narratives at scale with Claude + flagging dangerous combinations in real data.
