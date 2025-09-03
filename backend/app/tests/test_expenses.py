from app.crud.expense import create_expense, get_expenses
from app.db.session import get_db
from app.schemas.expense import ExpenseCreate, ExpenseResponse
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/", response_model=list[ExpenseResponse])
def read_expenses(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    expenses = get_expenses(db, skip=skip, limit=limit)
    return expenses


@router.post("/", response_model=ExpenseResponse)
def add_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = create_expense(db, expense)
    if db_expense is None:
        raise HTTPException(status_code=400, detail="Expense could not be created")
    return db_expense
