from crewai_tools import tool

@tool("track_application_status")
def track_application_status(application_id: str) -> dict:
    """
    Tracks and updates application status.
    Args:
        application_id: Application identifier
    Returns:
        dict: Status update information
    """
    import random
    
    statuses = ["submitted", "under_review", "interview_scheduled", "pending", "rejected", "accepted"]
    
    return {
        "application_id": application_id,
        "status": random.choice(statuses),
        "last_updated": datetime.utcnow().isoformat(),
        "next_action": "Follow up in 7 days" if random.choice([True, False]) else None
    }
