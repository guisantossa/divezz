from typing import List, Optional

from app.db.models.user import User
from app.db.schemas.user import UserCreate, UserUpdate
from sqlalchemy.orm import Session


def create_user(db: Session, user: UserCreate) -> User:
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()


def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    db_user = get_user(db, user_id)
    if db_user:
        for key, value in user_update.dict(exclude_unset=True).items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int) -> Optional[User]:
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """
    Verifica credenciais e retorna o User se válidas, caso contrário None.

    Tenta usar app.core.security.verify_password (hash seguro). Se não existir,
    faz comparação direta (compatibilidade com implementações antigas).
    """
    user = get_user_by_email(db, email)
    if not user:
        return None

    # tenta detectar campo de senha mais comum no model
    stored_password = (
        getattr(user, "hashed_password", None)
        or getattr(user, "password_hash", None)
        or getattr(user, "password", None)
    )

    if stored_password is None:
        return None

    try:
        from app.core.security import verify_password  # type: ignore

        is_valid = verify_password(password, stored_password)
    except Exception:
        # fallback inseguro — apenas compatibilidade
        is_valid = password == stored_password

    return user if is_valid else None
