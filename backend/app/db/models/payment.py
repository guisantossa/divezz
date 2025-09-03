from datetime import datetime

from app.db.base import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric
from sqlalchemy.orm import relationship


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    from_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    to_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    value = Column(Numeric(10, 2), nullable=False)
    status = Column(Integer, nullable=False)  # e.g., 0 for pending, 1 for completed
    created_at = Column(DateTime, default=datetime.utcnow)
    paid_at = Column(DateTime, nullable=True)

    group = relationship("app.db.models.group.Group", back_populates="payments")
    from_user = relationship(
        "app.db.models.user.User",
        foreign_keys=[from_user_id],
        back_populates="payments_from",
    )
    to_user = relationship(
        "app.db.models.user.User",
        foreign_keys=[to_user_id],
        back_populates="payments_to",
    )
