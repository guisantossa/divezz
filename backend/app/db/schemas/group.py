from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class GroupBase(BaseModel):
    name: str
    emoji: Optional[str] = None


class GroupCreate(GroupBase):
    pass


class GroupUpdate(GroupBase):
    pass


class Group(GroupBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class GroupResponse(Group):
    members: List[int]  # List of user IDs who are members of the group
