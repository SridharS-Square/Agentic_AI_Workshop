from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import io
import pdfplumber
import docx

from core.auth import current_active_user
from models.user import User
from models.student import StudentProfile, StudentProfileRead, StudentProfileCreate

# Using a different variable name for the router to avoid conflicts
students_router = APIRouter()

@students_router.get("/", response_model=StudentProfileRead)
async def get_user_profile(
    user: User = Depends(current_active_user)
):
    """Get the profile of the current authenticated user."""
    profile = await StudentProfile.find_one(StudentProfile.user_id == user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found for this user.")
    return profile

@students_router.put("/", response_model=StudentProfileRead)
async def update_user_profile(
    profile_data: StudentProfileCreate,
    user: User = Depends(current_active_user)
):
    """Update the profile of the current authenticated user."""
    profile = await StudentProfile.find_one(StudentProfile.user_id == user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found for this user.")
    
    profile.name = profile_data.name
    profile.major = profile_data.major
    profile.skills = profile_data.skills
    profile.experience = profile_data.experience
    profile.job_types = profile_data.job_types  # This now matches the Pydantic field name
    profile.linkedin_url = profile_data.linkedin_url
        
    await profile.save()
    return profile

@students_router.post("/upload-resume", response_model=StudentProfileRead)
async def upload_resume(
    file: UploadFile = File(...),
    user: User = Depends(current_active_user)
):
    """Uploads a resume and updates the current user's profile."""
    profile = await StudentProfile.find_one(StudentProfile.user_id == user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found for this user.")

    # --- Text extraction logic ---
    content_type = file.content_type
    file_stream = io.BytesIO(await file.read())
    extracted_text = ""

    try:
        if "pdf" in content_type:
            with pdfplumber.open(file_stream) as pdf:
                extracted_text = "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())
        elif "openxmlformats-officedocument.wordprocessingml.document" in content_type:
            doc = docx.Document(file_stream)
            extracted_text = "\n".join([para.text for para in doc.paragraphs])
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a PDF or DOCX.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse file: {e}")

    if not extracted_text:
        raise HTTPException(status_code=400, detail="Could not extract any text from the resume.")
    # --- End of extraction logic ---

    profile.resume_text = extracted_text
    await profile.save()
    return profile