from sqlalchemy import Column, Integer, String
from ..database.config import Base

class DataType(Base):
    __tablename__ = "data_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)