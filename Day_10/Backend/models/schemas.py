from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class StudentProfile(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    resume_text: str
    preferences: Dict
    linkedin_url: Optional[str] = None
    created_at: Optional[datetime] = None

class JobListing(BaseModel):
    id: str
    title: str
    company: str
    description: str
    requirements: List[str]
    location: str
    work_type: str
    source: str

class RelevanceScore(BaseModel):
    job_id: str
    student_id: str
    total_score: float
    skill_match: float
    culture_fit: float
    goal_alignment: float
    explanation: str

class Application(BaseModel):
    id: str
    student_id: str
    job_id: str
    status: str = "prepared"
    tailored_resume: str
    cover_letter: Optional[str] = None
    applied_at: Optional[datetime] = None