from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ExpenseBase(BaseModel):
    group_id: int
    payer_id: int
    description: str
    total_value: float
    date: datetime


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(ExpenseBase):
    updated_at: Optional[datetime] = None


class Expense(ExpenseBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
