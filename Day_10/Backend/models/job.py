
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