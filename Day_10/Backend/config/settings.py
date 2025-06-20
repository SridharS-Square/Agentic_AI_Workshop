import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    DATABASE_URL = "sqlite:///./job_alerts.db"
    
settings = Settings()
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    DATABASE_URL = "sqlite:///./job_alerts.db"
    
settings = Settings()
