# flake8: noqa
from fastapi import APIRouter

router = APIRouter()

from .routers import auth, expenses, groups, settlements, users

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(groups.router, prefix="/groups", tags=["groups"])
router.include_router(expenses.router, prefix="/expenses", tags=["expenses"])
router.include_router(settlements.router, prefix="/settlements", tags=["settlements"])
