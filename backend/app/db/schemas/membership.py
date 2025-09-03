from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class MembershipBase(BaseModel):
    user_id: Optional[int]
    group_id: Optional[int]
    role: Optional[str]


class MembershipCreate(BaseModel):
    email: EmailStr


class MembershipRead(BaseModel):
    id: int
    user_id: Optional[int]
    invited_email: Optional[EmailStr]
    status: str
    role: Optional[str]
    created_at: Optional[datetime]

    class Config:
        orm_mode = True
