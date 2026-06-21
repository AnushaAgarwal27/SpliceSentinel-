"""
Configuration and environment setup.
"""

import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# API Keys
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
OPENFDA_API_KEY = os.getenv("OPENFDA_API_KEY", "")

# Validation
if not ANTHROPIC_API_KEY:
    raise ValueError("❌ ANTHROPIC_API_KEY not set in .env")

# Server config
HOST = "0.0.0.0"
PORT = 8000
DEBUG = True

# Pharmakovigilance settings
PRR_THRESHOLD = 2.0  # Standard threshold for signal detection
MIN_HIGH_CONFIDENCE_REPORTS = 30
MIN_MODERATE_CONFIDENCE_REPORTS = 10
QUERY_LIMIT = 100  # Max results per openFDA query
