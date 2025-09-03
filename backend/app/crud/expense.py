from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from app.db.models.expense import Expense
from app.db.models.expense_share import ExpenseShare
from app.db.models.group import Group
from app.db.models.membership import Membership
from app.db.schemas.expense import ExpenseUpdate
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload


def create_expense(db: Session, expense, user_id: Optional[int] = None) -> Expense:
    """
    Create an Expense and ensure required DB fields are populated.
    """
    # normalize numeric value (backend model currently uses Integer; convert if needed)
    total_val = getattr(expense, "total_value", None)
    if total_val is not None:
        try:
            # keep as float here; DB column may be Integer — see note below
            total_val = float(total_val)
        except Exception:
            total_val = None

    e = Expense(
        description=getattr(expense, "description", None),
        total_value=(
            int(total_val)
            if total_val is not None
            and isinstance(total_val, float)
            and str(total_val).isdigit()
            else (total_val if total_val is not None else 0)
        ),
        group_id=getattr(expense, "group_id", None),
        payer_id=getattr(expense, "payer_id", user_id),
        # set created_by from the current user if available (fixes NOT NULL error)
        created_by=(
            user_id if user_id is not None else getattr(expense, "created_by", None)
        ),
        date=getattr(expense, "date", datetime.utcnow()),
        created_at=getattr(expense, "created_at", datetime.utcnow()),
        updated_at=getattr(expense, "updated_at", datetime.utcnow()),
    )
    db.add(e)
    db.commit()
    db.refresh(e)
    return e


def get_expense(
    db: Session, expense_id: int, user_id: Optional[int] = None
) -> Optional[Expense]:
    """
    Return expense by id. If user_id is provided, verify the user has access
    (is group owner or a membership). Returns None when not found or not allowed.
    """
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        return None

    if user_id is not None:
        # allow owner
        group = db.query(Group).filter(Group.id == expense.group_id).first()
        if group and group.owner_id == user_id:
            return expense

        # allow members
        is_member = (
            db.query(Membership)
            .filter(
                Membership.group_id == expense.group_id, Membership.user_id == user_id
            )
            .first()
        )
        if not is_member:
            return None

    return expense


def get_expenses(
    db: Session, skip: int = 0, limit: int = 100, user_id: Optional[int] = None
) -> List[Expense]:
    """
    Return expenses including related Group. Filtered by:
      - user is member of the expense group (Membership), OR
      - expense.created_by == user_id, OR
      - expense.payer_id == user_id
    """
    query = db.query(Expense).options(joinedload(Expense.group))
    if user_id is not None:
        query = query.outerjoin(
            Membership, Expense.group_id == Membership.group_id
        ).filter(
            or_(
                Membership.user_id == user_id,
                Expense.created_by == user_id,
                Expense.payer_id == user_id,
            )
        )
    return query.order_by(Expense.date.desc()).offset(skip).limit(limit).all()


def update_expense(
    db: Session, expense_id: int, expense: ExpenseUpdate
) -> Optional[Expense]:
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if db_expense:
        for key, value in expense.dict(exclude_unset=True).items():
            setattr(db_expense, key, value)
        db.commit()
        db.refresh(db_expense)
        return db_expense
    return None


def delete_expense(db: Session, expense_id: int) -> Optional[Expense]:
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if db_expense:
        db.delete(db_expense)
        db.commit()
        return db_expense
    return None


def create_expense_shares(
    db: Session, expense_id: int, splits: List[dict], user_id: Optional[int] = None
) -> List[ExpenseShare]:
    """
    Create/replace expense shares for an expense.
    Validates permission (using get_expense) and that sum(amount) == expense.total_value (within epsilon).
    """
    # permission + existence check (uses get_expense from this module)
    expense = get_expense(db=db, expense_id=expense_id, user_id=user_id)
    if not expense:
        raise ValueError("Expense not found or access denied")

    total = float(expense.total_value or 0)
    sum_amount = sum([float(s.get("amount", 0) or 0) for s in splits])
    # allow small rounding difference
    if abs(sum_amount - total) > 0.05:
        raise ValueError("Soma dos valores não corresponde ao total da despesa")

    # remove existing shares
    db.query(ExpenseShare).filter(ExpenseShare.expense_id == expense_id).delete()
    db.flush()

    created: List[ExpenseShare] = []
    for s in splits:
        user_id_item = int(s["user_id"])
        amount_item = float(s["amount"])
        perc = s.get("percentage")
        es = ExpenseShare(
            expense_id=expense_id,
            user_id=user_id_item,
            amount=amount_item,
            percentage=(float(perc) if perc is not None else None),
        )
        db.add(es)
        created.append(es)

    db.commit()
    # refresh created objects
    for es in created:
        db.refresh(es)
    return created
