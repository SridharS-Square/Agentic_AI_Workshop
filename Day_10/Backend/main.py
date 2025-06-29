import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from beanie import PydanticObjectId
from pydantic import EmailStr

# --- FIX: Import Base schemas from fastapi_users ---
from fastapi_users.schemas import BaseUserCreate, BaseUser

from core.ai_services import AIService
from core.database import init_beanie_db
from core.auth import auth_backend, fastapi_users
from api.students import students_router
from api.jobs import jobs_router

# --- FIX: Inherit from the correct fastapi_users base schemas ---
class UserRead(BaseUser[PydanticObjectId]):
    pass

class UserCreate(BaseUserCreate):
    pass

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Smart Job Matching API",
    description="Backend for the Hackathon project with MongoDB authentication.",
    version="2.4.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    """Initialize AI Service and Database on startup."""
    print("Creating AI Service instance...")
    app.state.ai_service = AIService()
    
    print("Initializing MongoDB connection with Beanie...")
    await init_beanie_db()
    print("Database initialization complete.")

# Include Authentication Routers
app.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"]
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate), prefix="/auth", tags=["auth"]
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserCreate), prefix="/users", tags=["users"]
)


# Include your custom API routers
app.include_router(students_router, prefix="/profile", tags=["Profile"])
app.include_router(jobs_router, prefix="/jobs", tags=["Jobs"])


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
