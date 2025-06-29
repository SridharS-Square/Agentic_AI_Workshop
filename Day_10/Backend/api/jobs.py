from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List
from pydantic import BaseModel, Field

from models.job import Job, JobMatchResponse
from core.ai_services import AIService
from core.auth import current_active_user
from models.user import User
from models.student import StudentProfile, StudentProfileRead, TrackedJob
from core.job_search import search_realtime_jobs
from core.dependencies import get_ai_service

# Using a different variable name for the router to avoid conflicts
jobs_router = APIRouter()

class JobSearchRequest(BaseModel):
    job_query: str
    location: str

class ExplainMatchRequest(BaseModel):
    job_details: Job

class TrackJobRequest(BaseModel):
    job: Job

class UpdateStatusRequest(BaseModel):
    status: str


@jobs_router.post("/match", response_model=List[JobMatchResponse])
async def match_jobs_for_current_user(
    request: JobSearchRequest,
    user: User = Depends(current_active_user),
    ai_service: AIService = Depends(get_ai_service),
):
    """
    Fetches live jobs and filters out any that the user is already tracking,
    then returns the remaining matches.
    """
    profile = await StudentProfile.find_one(StudentProfile.user_id == user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Please complete your profile before matching jobs.")

    # Fetch live jobs from the external API
    live_jobs = search_realtime_jobs(query=request.job_query, location=request.location)
    if not live_jobs:
        raise HTTPException(status_code=404, detail="Could not find any jobs for the given query.")

    tracked_jobs_cursor = TrackedJob.find(TrackedJob.user_id == user.id)
    tracked_jobs_identifiers = {(job.title, job.company) async for job in tracked_jobs_cursor}
    
    # Filter the live jobs list
    untracked_live_jobs = [
        job for job in live_jobs 
        if (job.title, job.company) not in tracked_jobs_identifiers
    ]
    
    if not untracked_live_jobs:
        return [] # Return an empty list if all found jobs are already tracked

    live_jobs_dict = {job.id: job for job in untracked_live_jobs}
    vector_store = ai_service.create_vector_store_from_jobs(untracked_live_jobs)
    
    if not vector_store:
        raise HTTPException(status_code=500, detail="Failed to create AI index for jobs.")

    profile_for_ai = StudentProfileRead.from_orm(profile)
    profile_summary = ai_service.create_profile_summary(profile_for_ai)
    results = vector_store.similarity_search_with_score(profile_summary, k=10)
    
    matched_jobs_details = []
    for doc, score in results:
        job_id = doc.metadata.get("job_id")
        job = live_jobs_dict.get(job_id)
        if job:
            response_data = job.model_dump()
            response_data["match_score"] = round((1 - score) * 100)
            matched_jobs_details.append(response_data)

    return matched_jobs_details


@jobs_router.post("/explain-match", response_model=dict)
async def explain_job_match(
    request: ExplainMatchRequest,
    user: User = Depends(current_active_user),
    ai_service: AIService = Depends(get_ai_service),
):
    """
    Generates a detailed explanation for a specific job match against the current user.
    """
    profile = await StudentProfile.find_one(StudentProfile.user_id == user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="User profile not found.")
        
    profile_for_ai = StudentProfileRead.from_orm(profile)
    explanation = ai_service.explain_match(profile_for_ai, request.job_details)
    return {"explanation": explanation}


@jobs_router.post("/track", response_model=TrackedJob, status_code=201)
async def track_job(
    request: TrackJobRequest,
    user: User = Depends(current_active_user),
):
    """Saves a job to the user's tracked jobs list."""
    job_data = request.job.dict()
    
    # Check if this job is already being tracked by the user
    existing_tracked_job = await TrackedJob.find_one(
        TrackedJob.user_id == user.id,
        TrackedJob.title == job_data["title"],
        TrackedJob.company == job_data["company"]
    )
    if existing_tracked_job:
        raise HTTPException(status_code=409, detail="This job is already being tracked.")
    
    if 'id' in job_data:
        del job_data['id']

    # Create a new TrackedJob document
    new_tracked_job = TrackedJob(**job_data, user_id=user.id)
    await new_tracked_job.insert()
    return new_tracked_job


@jobs_router.get("/track", response_model=List[TrackedJob])
async def get_tracked_jobs(user: User = Depends(current_active_user)):
    """Retrieves all jobs the current user is tracking."""
    tracked_jobs = await TrackedJob.find(TrackedJob.user_id == user.id).to_list()
    return tracked_jobs


@jobs_router.put("/track/{job_id}", response_model=TrackedJob)
async def update_tracked_job_status(
    job_id: str,
    request: UpdateStatusRequest,
    user: User = Depends(current_active_user),
):
    """Updates the status of a specific tracked job."""
    tracked_job = await TrackedJob.get(job_id)

    if not tracked_job or tracked_job.user_id != user.id:
        raise HTTPException(status_code=404, detail="Tracked job not found.")
    
    tracked_job.status = request.status
    await tracked_job.save()
    return tracked_job
