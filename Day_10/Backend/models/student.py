from pydantic import BaseModel, Field
from typing import List, Optional
from beanie import Document, PydanticObjectId
from models.job import Job


class TrackedJob(Document, Job):
    """
    Beanie Document model for a job that a user is tracking.
    It inherits all fields from the base Job Pydantic model and adds
    tracking-specific fields like status and user_id.
    """
    user_id: PydanticObjectId
    status: str = Field(default="Saved") 
    
    class Settings:
        name = "tracked_jobs"
class StudentProfile(Document):
    """Beanie Document model for the student profile (database layer)."""
    name: str = "New User"
    major: Optional[str] = None
    skills: List[str] = []
    experience: Optional[str] = None
    job_types: List[str] = []
    linkedin_url: Optional[str] = None
    resume_text: Optional[str] = None
    user_id: PydanticObjectId
    class Settings:
        name = "student_profiles"

class StudentProfileBase(BaseModel):
    """Base Pydantic model for profile data."""
    name: str
    major: Optional[str] = None
    skills: List[str] = []
    experience: Optional[str] = None
    job_types: List[str] = Field(default_factory=list, alias="jobTypes")
    linkedin_url: Optional[str] = None
    
class StudentProfileCreate(StudentProfileBase):
    pass

class StudentProfileRead(StudentProfileBase):
    """Pydantic model for reading profile data from the API."""
    id: PydanticObjectId = Field(..., alias="_id")
    user_id: PydanticObjectId
    resume_text: Optional[str] = None

    class Config:
        from_attributes = True
        populate_by_name = True 
        json_encoders = {PydanticObjectId: str}
