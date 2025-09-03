from typing import List, Optional

from app.db.models.settlement import Settlement
from app.db.schemas.payment import PaymentCreate
from sqlalchemy import or_
from sqlalchemy.orm import Session


def create_settlement(
    db: Session, settlement: PaymentCreate, user_id: int
) -> Settlement:
    """
    Cria um Settlement. `user_id` é quem está criando (created_by).
    """
    status = (
        settlement.status.value if getattr(settlement, "status", None) else "pending"
    )

    db_settlement = Settlement(
        group_id=settlement.group_id,
        from_user_id=settlement.from_user_id,
        to_user_id=settlement.to_user_id,
        amount=settlement.amount,
        status=status,
        created_by=user_id,
    )
    db.add(db_settlement)
    db.commit()
    db.refresh(db_settlement)
    return db_settlement


def get_settlements(
    db: Session, user_id: int, skip: int = 0, limit: int = 10
) -> List[Settlement]:
    """
    Retorna settlements onde o usuário é pagador ou recebedor.
    """
    return (
        db.query(Settlement)
        .filter(
            or_(Settlement.from_user_id == user_id, Settlement.to_user_id == user_id)
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_settlement(
    db: Session, settlement_id: int, user_id: int
) -> Optional[Settlement]:
    """
    Busca um settlement por id garantindo que o user_id tenha acesso (from/to).
    """
    return (
        db.query(Settlement)
        .filter(
            Settlement.id == settlement_id,
            or_(Settlement.from_user_id == user_id, Settlement.to_user_id == user_id),
        )
        .first()
    )


def delete_settlement(
    db: Session, settlement_id: int, user_id: int
) -> Optional[Settlement]:
    """
    Deleta um settlement se o usuário tiver permissão (from/to).
    Retorna o objeto deletado ou None.
    """
    settlement = get_settlement(db, settlement_id=settlement_id, user_id=user_id)
    if not settlement:
        return None
    db.delete(settlement)
    db.commit()
    return settlement
