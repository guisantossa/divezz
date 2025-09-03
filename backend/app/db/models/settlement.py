from app.db.base import Base
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    func,
)
from sqlalchemy.orm import relationship


class Settlement(Base):
    __tablename__ = "settlements"
    __table_args__ = (
        Index("ix_settlement_group", "group_id"),
        Index("ix_settlement_from_to", "from_user_id", "to_user_id"),
    )

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(
        Integer, ForeignKey("groups.id", ondelete="CASCADE"), nullable=False
    )
    from_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    to_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    # use Numeric for money; adjust precision/scale to your needs
    amount = Column(Numeric(12, 2), nullable=False)

    # status: "pending" | "paid"
    status = Column(String(16), nullable=False, default="pending", index=True)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    paid_at = Column(DateTime(timezone=True), nullable=True)

    # optional relationships for convenience
    from_user = relationship("User", foreign_keys=[from_user_id], lazy="joined")
    to_user = relationship("User", foreign_keys=[to_user_id], lazy="joined")
    creator = relationship("User", foreign_keys=[created_by], lazy="joined")

    def __repr__(self) -> str:
        return f"<Settlement id={self.id} {self.from_user_id}->{self.to_user_id} amount={self.amount} \
                status={self.status}>"
