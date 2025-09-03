from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class PaymentStatus(str, Enum):
    pending = "pending"
    paid = "paid"


class PaymentBase(BaseModel):
    group_id: int = Field(..., description="ID do grupo")
    from_user_id: int = Field(..., description="ID do pagador/quem envia")
    to_user_id: int = Field(..., description="ID do recebedor/quem recebe")
    amount: Decimal = Field(..., gt=0, description="Valor da quitação (decimal)")

    class Config:
        from_attributes = True


class PaymentCreate(PaymentBase):
    status: Optional[PaymentStatus] = Field(
        PaymentStatus.pending, description="Status inicial"
    )


class PaymentUpdate(BaseModel):
    status: Optional[PaymentStatus] = None
    paid_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Payment(PaymentBase):
    id: int
    status: PaymentStatus
    created_at: datetime
    paid_at: Optional[datetime] = None

    class Config:
        from_attributes = True
