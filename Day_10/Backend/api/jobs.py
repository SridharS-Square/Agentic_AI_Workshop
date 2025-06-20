from fastapi import APIRouter, Depends, HTTPException
from typing import List

from models.job import Job
from models.student import StudentProfile
from core.ai_services import AIService
from core.security import get_api_key
from data.store import db, get_job_by_id

# Import the dependency function from its new, neutral location
from core.dependencies import get_ai_service

router = APIRouter()

@router.get("/", response_model=List[Job])
def get_all_jobs():
    """Returns all jobs from the mock database."""
    return db["jobs"]

@router.post("/match", response_model=List[dict], dependencies=[Depends(get_api_key)])
def match_jobs_for_student(
    student_profile: StudentProfile,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Finds and returns jobs that match the student's profile using the RAG pipeline.
    This endpoint is secured with an API key.
    """
    if not ai_service or not ai_service.vector_store:
        raise HTTPException(status_code=503, detail="AI Service not initialized or ready.")
    
    matches = ai_service.match_jobs(student_profile)
    
    matched_jobs_details = []
    for match in matches:
        job = get_job_by_id(match["job_id"])
        if job:
            job_with_match = job.dict()
            job_with_match["match"] = f"{match['match_score']}%"
            matched_jobs_details.append(job_with_match)

    return matched_jobs_details


@router.post("/{job_id}/explain-match", response_model=dict, dependencies=[Depends(get_api_key)])
def explain_job_match(
    job_id: int,
    student_profile: StudentProfile,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Uses the CrewAI agentic workflow to generate a detailed explanation for a job match.
    This endpoint is secured with an API key.
    """
    job = get_job_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if not ai_service:
        raise HTTPException(status_code=503, detail="AI Service not initialized.")

    try:
        explanation = ai_service.explain_match(student_profile, job)
        return {"explanation": explanation}
    except Exception as e:
        print(f"Error during CrewAI execution: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate explanation: {e}")


@router.get("/{job_id}", response_model=Job)
def get_job_details(job_id: int):
    """Returns the details for a specific job."""
    job = get_job_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job