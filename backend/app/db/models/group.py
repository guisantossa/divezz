from __future__ import annotations

from app.db.base import Base
from sqlalchemy import Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship


class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    emoji = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    owner_id = Column(Integer, nullable=False)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # direct relation to Membership rows
    memberships = relationship(
        "Membership", back_populates="group", cascade="all, delete-orphan"
    )

    # convenience many-to-many: Group.members (via memberships)
    members = relationship(
        "User", secondary="memberships", back_populates="groups", viewonly=True
    )

    # ensure these match names used in Expense/Payment models
    expenses = relationship("Expense", back_populates="group")
    payments = relationship("Payment", back_populates="group")
