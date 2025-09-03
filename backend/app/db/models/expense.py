from datetime import datetime

from app.db.base import Base
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    payer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    description = Column(String, nullable=False)
    total_value = Column(Float, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # use fully-qualified class names to avoid import-order/circular issues
    group = relationship("app.db.models.group.Group", back_populates="expenses")
    payer = relationship(
        "app.db.models.user.User",
        foreign_keys=[payer_id],
        back_populates="expenses_paid",
    )
    creator = relationship(
        "app.db.models.user.User",
        foreign_keys=[created_by],
        back_populates="expenses_created",
    )
