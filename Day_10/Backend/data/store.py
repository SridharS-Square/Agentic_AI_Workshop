# data/store.py
from models.student import StudentProfileInDB
from core.job_search import search_realtime_jobs
from core.config import settings

# Our in-memory "database"
db = {
    "students": [],
    "jobs": [], # This will be populated at startup by SerpApi
    "applications": [],
}

def get_job_by_id(job_id: int):
    """Helper function to find a job in the mock DB by its ID."""
    for job in db["jobs"]:
        if job.id == job_id:
            return job
    return None

def initialize_data_stores(ai_service):
    """
    Initializes data stores: Fetches jobs from SerpApi at startup,
    loads them into the DB, and indexes them in the AI service.
    """
    # 1. Fetch real-time jobs using the initial query from settings
    print("Performing initial job search from SerpApi...")
    initial_jobs = search_realtime_jobs(
        query=settings.INITIAL_JOB_QUERY,
        location=settings.INITIAL_JOB_LOCATION
    )
    db["jobs"] = initial_jobs
    
    if not db["jobs"]:
        print("Warning: Could not fetch initial jobs from SerpApi. Matching will not work.")
    else:
        print(f"Successfully loaded {len(db['jobs'])} jobs from SerpApi.")
        # 2. Index the newly loaded jobs for the AI service to use
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