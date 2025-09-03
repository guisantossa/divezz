from app.core.security import get_current_user
from app.db.models.user import User
from app.db.session import get_db
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session


def get_current_active_user(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )
    return current_user
