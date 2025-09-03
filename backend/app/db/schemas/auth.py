from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str

    model_config = ConfigDict(from_attributes=True)


class TokenData(BaseModel):
    user_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class Login(BaseModel):
    email: str
    password: str

    model_config = ConfigDict(from_attributes=True)
