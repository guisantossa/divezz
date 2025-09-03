from typing import List

from app.api.deps import get_current_user, get_db
from app.crud import group as crud_group
from app.db.models.membership import Membership
from app.db.models.user import User as UserModel

# schemas / types used by the router
from app.db.schemas.group import Group as GroupSchema
from app.db.schemas.group import GroupCreate, GroupUpdate
from app.db.schemas.membership import MembershipCreate as MembershipCreateSchema
from app.db.schemas.membership import MembershipRead as MembershipReadSchema
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

router = APIRouter()


@router.post("/", response_model=GroupSchema)
def create_group(
    group_in: GroupCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    return crud_group.create_group(db=db, group=group_in, owner_id=current_user.id)


@router.get("/", response_model=List[GroupSchema])
def read_groups(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    groups = crud_group.get_groups(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    return groups


@router.get("/{group_id}")
def read_group(
    group_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    """
    Return group with memberships (and users) normalized for the frontend.
    """
    group = crud_group.get_group(db=db, group_id=group_id, user_id=current_user.id)
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found or access denied",
        )

    # load memberships with user relation to ensure we have all fields
    memberships = (
        db.query(Membership)
        .options(joinedload(Membership.user))
        .filter(Membership.group_id == group_id)
        .all()
    )

    # normalize memberships for JSON response
    memberships_out = []
    for m in memberships:
        memberships_out.append(
            {
                "id": m.id,
                "user_id": m.user_id,
                "invited_email": m.invited_email,
                "status": m.status,
                "role": m.role,
                "created_at": m.created_at,
                "updated_at": getattr(m, "updated_at", None),
                "user": (
                    None
                    if not getattr(m, "user", None)
                    else {
                        "id": m.user.id,
                        "name": m.user.name,
                        "email": m.user.email,
                        "photo_url": getattr(m.user, "photo_url", None),
                    }
                ),
            }
        )

    resp = {
        "id": group.id,
        "name": group.name,
        "emoji": getattr(group, "emoji", None),
        "photo_url": getattr(group, "photo_url", None),
        "owner_id": group.owner_id,
        "created_at": group.created_at,
        "memberships": memberships_out,
        # backward compatibility: also include "members" / "users" views
        "members": [m["user"] for m in memberships_out if m["user"]],
        "users": [m["user"] for m in memberships_out if m["user"]],
    }

    return resp


@router.put("/{group_id}", response_model=GroupSchema)
def update_group(
    group_id: int,
    group_in: GroupUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    updated_group = crud_group.update_group(
        db=db, group_id=group_id, group=group_in, owner_id=current_user.id
    )
    if updated_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return updated_group


@router.delete("/{group_id}", response_model=GroupSchema)
def delete_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    deleted_group = crud_group.delete_group(
        db=db, group_id=group_id, owner_id=current_user.id
    )
    if deleted_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return deleted_group


@router.post(
    "/{group_id}/invite",
    response_model=MembershipReadSchema,
    status_code=status.HTTP_201_CREATED,
)
def invite_member(
    group_id: int,
    payload: MembershipCreateSchema,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # check group exists and current_user has permission (owner or member)
    group = crud_group.get_group(db=db, group_id=group_id, user_id=current_user.id)
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found or access denied",
        )

    try:
        membership = crud_group.invite_member(
            db=db, group_id=group_id, email=payload.email, invited_by=current_user.id
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return membership
