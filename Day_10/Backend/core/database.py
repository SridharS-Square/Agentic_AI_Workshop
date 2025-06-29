# core/database.py

import os
from beanie import init_beanie, PydanticObjectId
from fastapi_users_db_beanie import BeanieUserDatabase
import motor.motor_asyncio

from models.user import User
from models.student import StudentProfile, TrackedJob

# Load MongoDB connection string from environment variables
MONGO_DB_URL = os.getenv("MONGO_DB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "hackathondb")

# Create a Motor client
client = motor.motor_asyncio.AsyncIOMotorClient(
    MONGO_DB_URL, uuidRepresentation="standard"
)

# Get the database
db = client[DB_NAME]


async def init_beanie_db():
    """
    Initializes the Beanie ODM with all the Document models.
    This should be called on application startup.
    """
    print(f"Connecting to MongoDB at {MONGO_DB_URL}...")
    await init_beanie(
        database=db,
        document_models=[
            User,
            StudentProfile,
            TrackedJob
        ],
    )
    print("Beanie ODM initialized successfully.")


from typing import AsyncGenerator

async def get_user_db() -> AsyncGenerator[BeanieUserDatabase[User], None]:
    yield BeanieUserDatabase(User)
