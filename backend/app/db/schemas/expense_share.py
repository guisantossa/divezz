from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ExpenseShareCreate(BaseModel):
    user_id: int
    amount: float
    percentage: Optional[float] = None


class ExpenseShareRead(BaseModel):
    id: int
    expense_id: int
    user_id: int
    amount: float
    percentage: Optional[float] = None
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True
