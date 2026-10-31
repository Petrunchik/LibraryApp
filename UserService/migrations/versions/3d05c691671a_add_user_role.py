"""add user role

Revision ID: 3d05c691671a
Revises: 86f107138e37
Create Date: 2026-10-31 16:57:54.658679

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '3d05c691671a'
down_revision: Union[str, Sequence[str], None] = '86f107138e37'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    role_type = postgresql.ENUM('reader', 'manager', 'admin', name='user_role')
    role_type.create(op.get_bind(), checkfirst=True)
    op.add_column(
        'users',
        sa.Column('role', role_type, server_default='reader', nullable=False),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'role')
    postgresql.ENUM(name='user_role').drop(op.get_bind(), checkfirst=True)
