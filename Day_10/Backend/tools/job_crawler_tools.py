from crewai_tools import tool
from typing import List
from models.schemas import JobListing
import uuid

@tool("fetch_relevant_jobs")
def fetch_relevant_jobs(preferences: dict, limit: int = 10) -> List[dict]:
    """
    Fetches relevant job listings based on student preferences.
    Args:
        preferences: Student's job preferences
        limit: Maximum number of jobs to fetch
    Returns:
        List[dict]: List of relevant job listings
    """
    # Mock job data generation based on preferences
    job_titles = [
        "Software Engineer", "Data Scientist", "Product Manager", 
        "DevOps Engineer", "Full Stack Developer", "ML Engineer",
        "Backend Developer", "Frontend Developer", "AI Engineer", "Cloud Architect"
    ]
    
    companies = [
        "TechCorp", "InnovateLab", "DataDriven Inc", "CloudFirst",
        "StartupHub", "Enterprise Solutions", "AI Dynamics", "CodeCraft"
    ]
    
    mock_jobs = []
    for i in range(limit):
        job = {
            "id": str(uuid.uuid4()),
            "title": job_titles[i % len(job_titles)],
            "company": companies[i % len(companies)],
            "description": f"Exciting opportunity in {preferences.get('industry_focus', 'technology')} with focus on innovation and growth.",
            "requirements": ["Python", "Problem Solving", "Communication", "Teamwork"],
            "location": "Remote" if preferences.get('work_preference') == 'remote' else "San Francisco",
            "work_type": preferences.get('work_preference', 'hybrid'),
            "source": "LinkedIn Mock"
        }
        mock_jobs.append(job)
    
    return mock_jobs

@tool("save_job_listings")
def save_job_listings(jobs: List[dict]) -> List[str]:
    """
    Saves job listings to database.
    Args:
        jobs: List of job listings to save
    Returns:
        List[str]: List of saved job IDs
    """
    from database.db import SessionLocal, JobListingDB
    
    db = SessionLocal()
    job_ids = []
    try:
        for job_data in jobs:
            job = JobListingDB(
                id=job_data['id'],
                title=job_data['title'],
                company=job_data['company'],
                description=job_data['description'],
                requirements=job_data['requirements'],
                location=job_data['location'],
                work_type=job_data['work_type'],
                source=job_data['source']
            )
            db.merge(job)  # Use merge to handle duplicates
            job_ids.append(job.id)
        db.commit()
        return job_ids
    finally:
        db.close()