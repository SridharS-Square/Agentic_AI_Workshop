from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.application import Application
from data.store import db
from typing import List

router = APIRouter()

class ApplicationCreate(BaseModel):
    student_id: int
    job_id: int

@router.post("/", response_model=Application, status_code=201)
def create_application(app_data: ApplicationCreate):
    new_id = len(db["applications"]) + 1
    new_application = Application(
        id=new_id,
        student_id=app_data.student_id,
        job_id=app_data.job_id
    )
    db["applications"].append(new_application)
    return new_application


@router.get("/student/{student_id}", response_model=List[Application])
def get_student_applications(student_id: int):
    return [app for app in db["applications"] if app.student_id == student_id]