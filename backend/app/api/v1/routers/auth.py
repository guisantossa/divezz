from __future__ import annotations

from app.api.deps import get_current_user, get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from app.db.models.user import User as UserModel
from app.db.schemas.auth import Login, Token
from app.db.schemas.user import User as UserRead
from app.db.schemas.user import UserCreate
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/register", response_model=Token)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    # check existing email
    existing = db.query(UserModel).filter(UserModel.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )
    hashed = get_password_hash(payload.password)
    user = UserModel(
        name=payload.name,
        email=payload.email,
        hashed_password=hashed,
        phone=payload.phone,
        photo_url=payload.photo_url,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(subject=str(user.id))
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
def login(payload: Login, db: Session = Depends(get_db)):
    # accepts JSON { email, password } (uses UserCreate for fields)
    user = db.query(UserModel).filter(UserModel.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    token = create_access_token(subject=str(user.id))
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserRead)
def me(current_user: UserModel = Depends(get_current_user)):
    return current_user
