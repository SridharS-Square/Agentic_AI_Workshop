import os
from dotenv import load_dotenv

load_dotenv()
print(os.getenv("GEMINI_API_KEY"))
class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")

settings = Settings()