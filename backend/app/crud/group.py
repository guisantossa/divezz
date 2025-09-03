from __future__ import annotations

from datetime import datetime
from typing import Any, List, Optional

from app.db.models.group import Group
from app.db.models.membership import Membership
from app.db.models.user import User
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload


def create_group(db: Session, group, owner_id: int) -> Group:
    """
    Create a group and ensure created_at is populated to avoid DB NOT NULL errors.
    """
    g = Group(
        name=group.name,
        emoji=getattr(group, "emoji", None),
        photo_url=getattr(group, "photo_url", None),
        owner_id=owner_id,
        created_at=getattr(group, "created_at", None) or datetime.utcnow(),
    )
    db.add(g)
    db.commit()
    db.refresh(g)
    return g


def get_group(
    db: Session, group_id: int, user_id: Optional[int] = None
) -> Optional[Group]:
    """
    Return a Group by id, loading memberships and user relation.
    If user_id is provided, require that the user is the owner or a member;
    return None if not allowed.
    """
    q = (
        db.query(Group)
        .options(joinedload(Group.memberships).joinedload(Membership.user))
        .filter(Group.id == group_id)
    )

    group = q.first()
    if not group:
        return None

    if user_id is not None:
        # allow if owner or has a membership
        is_member = any(
            getattr(m, "user_id", None) == user_id
            for m in getattr(group, "memberships", [])
        )
        if group.owner_id != user_id and not is_member:
            return None

    return group


def get_groups(
    db: Session, user_id: Optional[int] = None, skip: int = 0, limit: int = 100
) -> List[Group]:
    """
    Return groups. If user_id is provided, return groups where the user is owner OR a member.
    """
    query = db.query(Group)
    if user_id is not None:
        # include groups where user is owner OR has a membership
        query = query.outerjoin(Membership, Group.id == Membership.group_id).filter(
            or_(Membership.user_id == user_id, Group.owner_id == user_id)
        )
    return query.offset(skip).limit(limit).all()


def update_group(
    db: Session, group_id: int, group: Any, owner_id: Optional[int] = None
) -> Optional[Group]:
    """
    Update group fields. If owner_id is provided, verify the user has permission (owner or member).
    `group` can be a Pydantic model or dict with fields to update.
    """
    db_group = db.query(Group).filter(Group.id == group_id).first()
    if not db_group:
        return None

    # permission check: owner or membership
    if owner_id is not None:
        is_member = (
            db.query(Membership)
            .filter(Membership.group_id == group_id, Membership.user_id == owner_id)
            .first()
        )
        if db_group.owner_id != owner_id and not is_member:
            # access denied
            return None

    # allow group to be pydantic model or dict-like
    updates = group.dict(exclude_unset=True) if hasattr(group, "dict") else dict(group)
    for key, value in updates.items():
        if hasattr(db_group, key):
            setattr(db_group, key, value)

    db_group.updated_at = datetime.utcnow()
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group


def delete_group(db: Session, group_id: int) -> Optional[Group]:
    db_group = db.query(Group).filter(Group.id == group_id).first()
    if db_group:
        db.delete(db_group)
        db.commit()
    return db_group


def invite_member(
    db: Session, group_id: int, email: str, invited_by: Optional[int] = None
) -> Membership:
    """
    Invite a user by email to the group.
    Now: require that the user already exists. If not, raise ValueError("Usuário não cadastrado").
    """
    # normalize email
    email = email.strip().lower()

    # lookup existing user
    user = db.query(User).filter(User.email == email).first()

    # if user does not exist, return explicit error (we don't create pending invites)
    if not user:
        raise ValueError("Usuário não cadastrado")

    # check for existing membership by user_id
    existing = (
        db.query(Membership)
        .filter(Membership.group_id == group_id, Membership.user_id == user.id)
        .first()
    )
    if existing:
        raise ValueError("User is already a member or already invited")

    m = Membership(
        group_id=group_id,
        user_id=user.id,
        invited_email=None,
        status="pending",
        role=None,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m
