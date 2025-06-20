from typing import Dict, List
from models.job import Job
from models.student import StudentProfileInDB
from models.application import Application
from .mock_data import MOCK_JOBS

# In-memory storage
db: Dict[str, List] = {
    "jobs": [],
    "students": [],
    "applications": [],
}

def initialize_data_stores(ai_service):
    """
    Populates the in-memory store with mock data and builds the vector store.
    This should be called on application startup.
    """
    if not db["jobs"]:
        db["jobs"].extend(MOCK_JOBS)
    
    # Use the AI service to index the jobs
    ai_service.index_jobs(db["jobs"])

def get_job_by_id(job_id: int) -> Job | None:
    for job in db["jobs"]:
        if job.id == job_id:
            return job
    return None