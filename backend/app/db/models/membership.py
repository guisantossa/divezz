from __future__ import annotations

from datetime import datetime

from app.db.base import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class Membership(Base):
    __tablename__ = "memberships"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    role = Column(String(32), nullable=True)

    # new: invited_email for invites by email (nullable when user exists)
    invited_email = Column(String(255), nullable=True)

    # new: status (pending/accepted/declined) with server default
    status = Column(
        String(20), nullable=False, server_default="pending", default="pending"
    )

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    user = relationship("User", back_populates="memberships")
    group = relationship("Group", back_populates="memberships")
