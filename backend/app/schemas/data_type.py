from pydantic import BaseModel, Field

class DataTypeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    description: str | None = None

class DataTypeCreate(DataTypeBase):
    pass

class DataType(DataTypeBase):
    id: int

    class Config:
        from_attributes = True