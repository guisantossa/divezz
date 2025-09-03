from __future__ import annotations

from app.db.base import Base
from sqlalchemy import Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # direct relation to Membership rows
    memberships = relationship(
        "Membership", back_populates="user", cascade="all, delete-orphan"
    )

    # convenience many-to-many: User.groups (via memberships)
    groups = relationship(
        "Group",
        secondary="memberships",
        back_populates="members",
        viewonly=True,
    )

    payments_from = relationship(
        "Payment", foreign_keys="Payment.from_user_id", back_populates="from_user"
    )
    payments_to = relationship(
        "Payment", foreign_keys="Payment.to_user_id", back_populates="to_user"
    )

    # optional expense relationships if present in expense model
    expenses_paid = relationship(
        "Expense", foreign_keys="Expense.payer_id", back_populates="payer"
    )
    expenses_created = relationship(
        "Expense", foreign_keys="Expense.created_by", back_populates="creator"
    )

    def __repr__(self):
        return f"<User(id={self.id}, name={self.name}, email={self.email})>"
