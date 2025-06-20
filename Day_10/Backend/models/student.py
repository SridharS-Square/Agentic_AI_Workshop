
from pydantic import BaseModel, EmailStr
from typing import List, Optional

class StudentProfile(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    university: Optional[str] = None
    major: Optional[str] = None
    graduationYear: Optional[str] = None
    skills: List[str] = []
    experience: Optional[str] = ""
    location: Optional[str] = None
    jobTypes: List[str] = []

class StudentProfileInDB(StudentProfile):
    id: int