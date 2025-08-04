from datetime import date
from pydantic import BaseModel, Field

class DataEntryBase(BaseModel):
    date: date
    type: str = Field(..., min_length=1)
    value: float

class DataEntryCreate(DataEntryBase):
    pass

class DataEntry(DataEntryBase):
    id: int

    class Config:
        from_attributes = True