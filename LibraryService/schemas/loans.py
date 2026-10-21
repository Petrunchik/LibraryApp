from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

class LoanResponse(BaseModel):
    id: UUID
    loaned_at: datetime
    book_copy_id: UUID
    returned_at: datetime
    user_id: UUID
    issued_by: UUID
    accepted_by: UUID
