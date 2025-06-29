# core/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    SERPAPI_API_KEY: str = os.getenv("SERPAPI_API_KEY")
    
    # Add these lines for the initial search at startup
    INITIAL_JOB_QUERY: str = os.getenv("INITIAL_JOB_QUERY", "Software Developer")
    INITIAL_JOB_LOCATION: str = os.getenv("INITIAL_JOB_LOCATION", "Chennai")


settings = Settings()