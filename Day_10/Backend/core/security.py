from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader

# Define the API key header that the client should use
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=True)

# This is our "secret" API key. In a real application, you'd load this
# securely from your environment variables, just like the Gemini key.
# For the hackathon, we can define it here for simplicity.
# Let's add it to the .env file for good practice.
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("API_KEY", "your-super-secret-hackathon-key")


async def get_api_key(api_key: str = Security(api_key_header)):
    """
    Dependency that checks if the provided API key in the X-API-Key header is valid.
    """
    if api_key == API_KEY:
        return api_key
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API Key",
        )