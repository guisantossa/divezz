from app.api.deps import get_current_user, get_db
from app.crud import settlements as crud
from app.db.models import user as models
from app.db.schemas import payment as schemas
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/", response_model=schemas.Payment)
def create_settlement(
    settlement: schemas.PaymentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_settlement(db=db, settlement=settlement, user_id=current_user.id)


@router.get("/", response_model=list[schemas.Payment])
def read_settlements(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    settlements = crud.get_settlements(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    return settlements


@router.get("/{settlement_id}", response_model=schemas.Payment)
def read_settlement(
    settlement_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    settlement = crud.get_settlement(
        db=db, settlement_id=settlement_id, user_id=current_user.id
    )
    if settlement is None:
        raise HTTPException(status_code=404, detail="Settlement not found")
    return settlement


@router.delete("/{settlement_id}", response_model=schemas.Payment)
def delete_settlement(
    settlement_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    settlement = crud.delete_settlement(
        db=db, settlement_id=settlement_id, user_id=current_user.id
    )
    if settlement is None:
        raise HTTPException(status_code=404, detail="Settlement not found")
    return settlement
