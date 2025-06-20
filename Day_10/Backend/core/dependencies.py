# /core/dependencies.py

from fastapi import Request
from .ai_services import AIService

def get_ai_service(request: Request) -> AIService:
    """
    Dependency function to retrieve the shared AIService instance
    from the application state for each request.
    """
    if not hasattr(request.app.state, 'ai_service'):
        return None
    return request.app.state.ai_service