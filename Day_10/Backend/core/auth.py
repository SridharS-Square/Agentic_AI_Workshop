import os
from typing import Optional
from fastapi import Depends, Request
from beanie import PydanticObjectId
from fastapi_users import BaseUserManager, FastAPIUsers
from fastapi_users.authentication import AuthenticationBackend, BearerTransport, JWTStrategy

from core.database import get_user_db
from models.user import User
from models.student import StudentProfile

# Load a secret key for signing JWTs from environment variables
SECRET = os.getenv("AUTH_SECRET_KEY", "your-default-super-secret-key-for-auth")

class UserManager(BaseUserManager[User, PydanticObjectId]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    def parse_id(self, id: str) -> PydanticObjectId:
        return PydanticObjectId(id)

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        """
        This method is called after a user successfully registers.
        It creates a corresponding blank StudentProfile for the new user.
        """
        print(f"User {user.id} has registered.")
        new_profile = StudentProfile(user_id=user.id, name=user.email)
        await new_profile.insert()
        print(f"Created blank profile for user {user.id}")


async def get_user_manager(user_db = Depends(get_user_db)):
    yield UserManager(user_db)

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=BearerTransport(tokenUrl="auth/jwt/login"),
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, PydanticObjectId](
    get_user_manager,
    [auth_backend],
)

current_active_user = fastapi_users.current_user(active=True)
