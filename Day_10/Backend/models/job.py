from pydantic import BaseModel, Field
from typing import List, Optional

class Job(BaseModel):
    id: int
    title: str
    company: str
    location: str
    type: str
    salary: Optional[str] = None
    description: str
    requirements: List[str]
    posted: str
    apply_link: Optional[str] = None 

# --- ADD THIS NEW CLASS ---
class JobMatchResponse(Job):
    """
    The response model for a matched job, including the job details
    and the calculated match score.
    """
    match_score: int