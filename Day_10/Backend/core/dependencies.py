from fastapi import Request
from core.ai_services import AIService

def get_ai_service(request: Request) -> AIService:
    """
    Dependency function to retrieve the shared AIService instance
    from the application state for each request.
    """
    return request.app.state.ai_service