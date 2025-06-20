from fastapi import FastAPI, HTTPException, BackgroundTasks
from models.schemas import StudentProfile
from workflow.job_alert_workflow import execute_job_alert_pipeline
import asyncio

app = FastAPI(title="Smart Job Alert API")

@app.post("/submit-profile/")
async def submit_profile(profile: StudentProfile, background_tasks: BackgroundTasks):
    """Submit student profile and trigger job alert pipeline"""
    
    def run_pipeline():
        try:
            result = execute_job_alert_pipeline(profile.dict())
            print(f"Pipeline completed for {profile.email}: {result}")
        except Exception as e:
            print(f"Pipeline failed for {profile.email}: {str(e)}")
    
    # Run pipeline in background
    background_tasks.add_task(run_pipeline)
    
    return {
        "message": "Profile submitted successfully", 
        "email": profile.email,
        "status": "processing"
    }

@app.get("/")
async def root():
    return {"message": "Smart Job Alert System API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}