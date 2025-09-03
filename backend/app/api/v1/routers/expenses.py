from typing import List

from app.api.deps import get_current_user, get_db
from app.crud import expense as crud
from app.crud import expense as crud_expense
from app.db.schemas.expense import Expense, ExpenseCreate
from app.db.schemas.expense_share import ExpenseShareCreate, ExpenseShareRead
from app.db.schemas.user import User
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/", response_model=Expense)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return crud.create_expense(db=db, expense=expense, user_id=current_user.id)


@router.get("/", summary="List expenses for current user")
def read_expenses(
    skip: int = Query(0),
    limit: int = Query(100),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Returns expenses accessible to the current user. Each expense includes a `group` object
    when available (id, name, emoji, photo_url, owner_id).
    """
    expenses = crud.get_expenses(db=db, skip=skip, limit=limit, user_id=current_user.id)

    def serialize(e):
        g = getattr(e, "group", None)
        group_obj = None
        if g is not None:
            group_obj = {
                "id": getattr(g, "id", None),
                "name": getattr(g, "name", None),
                "emoji": getattr(g, "emoji", None),
                "photo_url": getattr(g, "photo_url", None),
                "owner_id": getattr(g, "owner_id", None),
            }
        return {
            "id": getattr(e, "id", None),
            "group": group_obj,
            "group_id": getattr(e, "group_id", None),
            "payer_id": getattr(e, "payer_id", None),
            "description": getattr(e, "description", None),
            "total_value": getattr(e, "total_value", None),
            "date": (
                getattr(e, "date").isoformat() if getattr(e, "date", None) else None
            ),
            "created_by": getattr(e, "created_by", None),
            "created_at": (
                getattr(e, "created_at").isoformat()
                if getattr(e, "created_at", None)
                else None
            ),
            "updated_at": (
                getattr(e, "updated_at").isoformat()
                if getattr(e, "updated_at", None)
                else None
            ),
        }

    return [serialize(e) for e in expenses]


@router.get("/{expense_id}", response_model=Expense)
def read_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = crud.get_expense(db=db, expense_id=expense_id, user_id=current_user.id)
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense


@router.delete("/{expense_id}", response_model=Expense)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = crud.delete_expense(db=db, expense_id=expense_id, user_id=current_user.id)
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense


@router.post(
    "/{expense_id}/split",
    response_model=List[ExpenseShareRead],
    status_code=status.HTTP_201_CREATED,
)
def split_expense(
    expense_id: int,
    payload: List[ExpenseShareCreate],
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        created = crud_expense.create_expense_shares(
            db=db,
            expense_id=expense_id,
            splits=[p.dict() for p in payload],
            user_id=current_user.id,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return created
