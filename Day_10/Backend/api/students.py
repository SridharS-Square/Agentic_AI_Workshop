# api/students.py

import io
import pdfplumber # You may need to run: pip install pdfplumber
import docx       # You may need to run: pip install python-docx
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List
from models.student import StudentProfile, StudentProfileInDB
from data.store import db

router = APIRouter()

def get_student_by_id(student_id: int) -> StudentProfileInDB:
    """Helper function to find a student in the mock DB."""
    for student in db["students"]:
        if student.id == student_id:
            return student
    return None

def extract_text_from_pdf(file_stream) -> str:
    """Extracts text content from a PDF file."""
    with pdfplumber.open(file_stream) as pdf:
        text = ""
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def extract_text_from_docx(file_stream) -> str:
    """Extracts text content from a DOCX file."""
    doc = docx.Document(file_stream)
    return "\n".join([para.text for para in doc.paragraphs])


# CHANGED: This endpoint now also handles linkedin_url
@router.post("/profile", response_model=StudentProfileInDB, status_code=201)
def create_or_update_student_profile(profile: StudentProfile):
    """
    Creates a new student profile or updates an existing one based on email.
    """
    existing_student_index = -1
    for i, student in enumerate(db["students"]):
        if student.email == profile.email:
            existing_student_index = i
            break
    
    if existing_student_index != -1:
        # Update existing student
        student_id = db["students"][existing_student_index].id
        updated_student = StudentProfileInDB(id=student_id, **profile.model_dump())
        db["students"][existing_student_index] = updated_student
        print(f"Updated profile for student ID: {student_id}")
        return updated_student
    else:
        # Create new student
        new_id = len(db["students"]) + 1
        new_student = StudentProfileInDB(id=new_id, **profile.model_dump())
        db["students"].append(new_student)
        print(f"Created new profile for student ID: {new_id}")
        return new_student


# NEW: Endpoint for uploading and processing a resume 
@router.post("/upload-resume", response_model=StudentProfileInDB)
async def upload_resume(student_id: int = Form(...), file: UploadFile = File(...)):
    """
    Uploads a resume, extracts its text, and updates the student profile.
    This fulfills the requirement of handling PDF/DOCX inputs.
    """
    student = get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    content_type = file.content_type
    file_stream = io.BytesIO(await file.read())
    extracted_text = ""

    try:
        if "pdf" in content_type:
            extracted_text = extract_text_from_pdf(file_stream)
        elif "openxmlformats-officedocument.wordprocessingml.document" in content_type:
            extracted_text = extract_text_from_docx(file_stream)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a PDF or DOCX.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse file: {e}")

    if not extracted_text:
        raise HTTPException(status_code=400, detail="Could not extract any text from the resume.")

    # Update the student's profile with the extracted text
    student.resume_text = extracted_text
    print(f"Successfully extracted and saved resume text for student {student_id}.")
    
    return student


@router.get("/{student_id}/profile", response_model=StudentProfileInDB)
def get_student_profile(student_id: int):
    student = get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student