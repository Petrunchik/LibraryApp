from enum import Enum


class UserRole(str, Enum):
    READER = "reader"
    MANAGER = "manager"
    ADMIN = "admin"
