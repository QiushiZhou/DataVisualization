from sqlalchemy import Column, Integer, Float, String, Date
from ..database.config import Base

class DataEntry(Base):
    __tablename__ = "data_entries"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    type = Column(String, nullable=False)
    value = Column(Float, nullable=False)