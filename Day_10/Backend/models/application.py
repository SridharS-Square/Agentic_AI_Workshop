
from pydantic import BaseModel
from typing import Optional

class Application(BaseModel):
    id: int
    student_id: int
    job_id: int
    status: str = "Applied"
    notes: Optional[str] = None