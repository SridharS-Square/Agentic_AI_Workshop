# models/student.py

from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional


class StudentProfile(BaseModel):
    name: str
    email: EmailStr
    linkedin_url: Optional[HttpUrl] = None
    phone: Optional[str] = None
    university: Optional[str] = None
    major: Optional[str] = None
    graduationYear: Optional[str] = None
    skills: List[str] = []
    experience: Optional[str] = ""
    location: Optional[str] = None
    jobTypes: List[str] = []
    resume_text: Optional[str] = None

class StudentProfileInDB(StudentProfile):
    id: int