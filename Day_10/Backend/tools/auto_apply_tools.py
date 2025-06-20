from crewai_tools import tool
import uuid

@tool("prepare_job_application")
def prepare_job_application(job: dict, student_profile: dict, score: dict) -> dict:
    """
    Prepares tailored job application materials.
    Args:
        job: Job listing details
        student_profile: Student profile information
        score: Relevance score details
    Returns:
        dict: Application materials
    """
    prompt = f"""
    Create a tailored resume and cover letter for this application:
    
    Job: {job.get('title')} at {job.get('company')}
    Job Requirements: {job.get('requirements')}
    
    Student Profile: {student_profile.get('resume_text')}
    Student Skills: {student_profile.get('preferences', {}).get('key_skills', [])}
    
    Generate:
    1. A tailored resume highlighting relevant experience
    2. A brief cover letter (if needed)
    
    Keep both concise and focused on job requirements.
    """
    
    response = model.generate_content(prompt)
    
    return {
        "id": str(uuid.uuid4()),
        "student_id": student_profile.get('id'),
        "job_id": job['id'],
        "status": "prepared",
        "tailored_resume": response.text[:1000],  # Truncate for demo
        "cover_letter": "Auto-generated cover letter",
        "applied_at": None
    }

@tool("save_application")
def save_application(application: dict) -> str:
    """
    Saves application to database.
    Args:
        application: Application details
    Returns:
        str: Application ID
    """
    # For demo purposes, return the application ID
    return application.get('id')