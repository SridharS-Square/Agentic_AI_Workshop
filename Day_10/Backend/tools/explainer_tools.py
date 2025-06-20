from crewai_tools import tool

@tool("generate_match_explanation")
def generate_match_explanation(job: dict, score: dict, preferences: dict) -> str:
    """
    Generates human-readable explanation for job relevance.
    Args:
        job: Job listing details
        score: Relevance score details
        preferences: Student preferences
    Returns:
        str: Human-readable match explanation
    """
    prompt = f"""
    Explain why this job matches the student's profile:
    
    Job: {job.get('title')} at {job.get('company')}
    Score: {score.get('total_score')}/100
    Student Preferences: {preferences}
    
    Provide a clear, concise explanation highlighting:
    - Key matching factors
    - Alignment with career goals
    - Any potential concerns
    
    Keep explanation under 150 words.
    """
    
    response = model.generate_content(prompt)
    return response.text.strip()