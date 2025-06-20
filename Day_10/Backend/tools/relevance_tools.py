from crewai_tools import tool

@tool("calculate_job_relevance")
def calculate_job_relevance(job: dict, preferences: dict, student_id: str) -> dict:
    """
    Calculates relevance score for a job based on student preferences.
    Args:
        job: Job listing details
        preferences: Student preferences
        student_id: Student identifier
    Returns:
        dict: Relevance score breakdown
    """
    prompt = f"""
    Score job relevance (0-100) for this match:
    
    Job: {job.get('title')} at {job.get('company')}
    Description: {job.get('description')}
    Requirements: {job.get('requirements')}
    
    Student Preferences: {preferences}
    
    Provide scores for:
    - skill_match (0-100)
    - culture_fit (0-100) 
    - goal_alignment (0-100)
    - total_score (average)
    
    Return JSON format only.
    """
    
    response = model.generate_content(prompt)
    try:
        scores = json.loads(response.text.strip().replace('```json', '').replace('```', ''))
        return {
            "job_id": job['id'],
            "student_id": student_id,
            "total_score": scores.get('total_score', 50),
            "skill_match": scores.get('skill_match', 50),
            "culture_fit": scores.get('culture_fit', 50),
            "goal_alignment": scores.get('goal_alignment', 50),
            "explanation": "AI-generated relevance score"
        }
    except:
        return {
            "job_id": job['id'],
            "student_id": student_id,
            "total_score": 60.0,
            "skill_match": 65.0,
            "culture_fit": 55.0,
            "goal_alignment": 60.0,
            "explanation": "Default scoring applied"
        }

@tool("save_relevance_scores")
def save_relevance_scores(scores: List[dict]) -> List[str]:
    """
    Saves relevance scores to database.
    Args:
        scores: List of relevance scores
    Returns:
        List[str]: List of saved score IDs
    """
    from database.db import SessionLocal, RelevanceScoreDB
    
    db = SessionLocal()
    score_ids = []
    try:
        for score_data in scores:
            score = RelevanceScoreDB(
                job_id=score_data['job_id'],
                student_id=score_data['student_id'],
                total_score=score_data['total_score'],
                skill_match=score_data['skill_match'],
                culture_fit=score_data['culture_fit'],
                goal_alignment=score_data['goal_alignment'],
                explanation=score_data['explanation']
            )
            db.add(score)
            score_ids.append(score.id)
        db.commit()
        return score_ids
    finally:
        db.close()