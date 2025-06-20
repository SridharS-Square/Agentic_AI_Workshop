from crewai_tools import tool
import google.generativeai as genai
from config.settings import settings
import json

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

@tool("analyze_student_profile")
def analyze_student_profile(resume_text: str, preferences: dict, linkedin_url: str = None) -> dict:
    """
    Analyzes student profile and extracts structured career goals and preferences.
    Args:
        resume_text: Student's resume content
        preferences: Student's job preferences
        linkedin_url: Optional LinkedIn profile URL
    Returns:
        dict: Structured career goals and preferences
    """
    prompt = f"""
    Analyze this student profile and extract structured career goals and preferences:
    
    Resume: {resume_text}
    Preferences: {preferences}
    LinkedIn: {linkedin_url or 'Not provided'}
    
    Extract and return JSON with:
    - company_type (startup/corporate/etc)
    - work_preference (remote/hybrid/office)
    - industry_focus
    - learning_preferences
    - career_goals
    - key_skills
    
    Return only valid JSON.
    """
    
    response = model.generate_content(prompt)
    try:
        return json.loads(response.text.strip().replace('```json', '').replace('```', ''))
    except:
        return {
            "company_type": "any",
            "work_preference": "hybrid",
            "industry_focus": "technology",
            "learning_preferences": ["mentorship"],
            "career_goals": ["growth"],
            "key_skills": []
        }

@tool("save_student_profile")
def save_student_profile(profile_data: dict) -> str:
    """
    Saves student profile to database.
    Args:
        profile_data: Complete student profile information
    Returns:
        str: Profile ID
    """
    from database.db import SessionLocal, StudentProfileDB
    
    db = SessionLocal()
    try:
        profile = StudentProfileDB(
            name=profile_data.get('name'),
            email=profile_data.get('email'),
            resume_text=profile_data.get('resume_text'),
            preferences=profile_data.get('preferences'),
            linkedin_url=profile_data.get('linkedin_url')
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile.id
    finally:
        db.close()