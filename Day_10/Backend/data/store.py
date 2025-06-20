# data/store.py

from typing import List
from models.job import Job
from models.student import StudentProfileInDB
from models.application import Application

# Import the expanded list from our mock data file
from .mock_data import MOCK_JOBS

# Our in-memory "database"
db = {
    "students": [],
    "jobs": [],
    "applications": [],
}

def get_job_by_id(job_id: int) -> Job | None:
    """Helper function to find a job in the mock DB."""
    for job in db["jobs"]:
        if job.id == job_id:
            return job
    return None

def initialize_data_stores(ai_service):
    """
    Initializes the data stores for the application.
    CHANGED: Now loads jobs from the MOCK_JOBS list.
    """
    # Load the rich mock data directly into our DB
    db["jobs"] = MOCK_JOBS
    print(f"Successfully loaded {len(db['jobs'])} mock jobs.")

    # Index the mock jobs for the AI service to use
    ai_service.index_jobs(db["jobs"])

    # You can still add a sample student if you want for testing
    if not db["students"]:
        sample_student = StudentProfileInDB(
            id=1,
            name="Test Student",
            email="test@example.com",
            skills=["Python", "FastAPI", "React"],
            jobTypes=["Internship"]
        )
        db["students"].append(sample_student)
        print("Added a sample student for testing.")