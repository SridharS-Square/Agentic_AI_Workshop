import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from api import students, jobs, applications
from core.ai_services import AIService
from data.store import initialize_data_stores

# Load environment variables from .env file
load_dotenv()

# Create the FastAPI app instance
app = FastAPI(
    title="Smart Job Matching API",
    description="Backend for the Hackathon project using FastAPI, CrewAI, and RAG.",
    version="1.0.0"
)

# Set up CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    """
    This function runs when the app starts. It creates a single instance
    of the AIService and attaches it to the application's state.
    """
    print("Creating AI Service instance...")
    app.state.ai_service = AIService()
    
    print("Initializing mock data and AI vector store...")
    # Pass the newly created instance to the initializer
    initialize_data_stores(app.state.ai_service)
    print("Initialization complete.")


# Include API routers from the /api directory
app.include_router(students.router, prefix="/students", tags=["Students"])
app.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
app.include_router(applications.router, prefix="/applications", tags=["Applications"])


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint to ensure the API is running."""
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)