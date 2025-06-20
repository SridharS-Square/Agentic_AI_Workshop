from fastapi import APIRouter, HTTPException
from typing import List
from models.student import StudentProfile, StudentProfileInDB
from data.store import db

router = APIRouter()

@router.post("/profile", response_model=StudentProfileInDB, status_code=201)
def create_or_update_student_profile(profile: StudentProfile):
    """
    Creates a new student profile or updates an existing one based on email.
    For this hackathon, we'll just add to a list.
    """
    # Check if student with this email already exists
    for i, student in enumerate(db["students"]):
        if student.email == profile.email:
            # Update existing student
            updated_student = StudentProfileInDB(id=student.id, **profile.dict())
            db["students"][i] = updated_student
            return updated_student

    # Create new student
    new_id = len(db["students"]) + 1
    new_student = StudentProfileInDB(id=new_id, **profile.dict())
    db["students"].append(new_student)
    return new_student

@router.get("/{student_id}/profile", response_model=StudentProfileInDB)
def get_student_profile(student_id: int):
    for student in db["students"]:
        if student.id == student_id:
            return student
    raise HTTPException(status_code=404, detail="Student not found")