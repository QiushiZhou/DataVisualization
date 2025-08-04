from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from .database.config import SessionLocal, engine
from .models import data_entry as entry_models
from .models import data_type as type_models
from .schemas import data_entry as entry_schemas
from .schemas import data_type as type_schemas
from .config import get_settings

settings = get_settings()

# 创建数据库表
entry_models.Base.metadata.create_all(bind=engine)
type_models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Data Visualization API")

# 配置 CORS - 允许所有来源，生产环境会通过环境变量限制
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源，生产环境应该限制为实际的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 健康检查端点
@app.get("/health")
def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}

# 依赖项
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Data Type CRUD 操作
@app.post("/data-types/", response_model=type_schemas.DataType)
def create_data_type(data_type: type_schemas.DataTypeCreate, db: Session = Depends(get_db)):
    try:
        db_type = type_models.DataType(**data_type.model_dump())
        db.add(db_type)
        db.commit()
        db.refresh(db_type)
        return db_type
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/data-types/", response_model=List[type_schemas.DataType])
def read_data_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(type_models.DataType).offset(skip).limit(limit).all()

@app.get("/data-types/{type_id}", response_model=type_schemas.DataType)
def read_data_type(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(type_models.DataType).filter(type_models.DataType.id == type_id).first()
    if db_type is None:
        raise HTTPException(status_code=404, detail="Data type not found")
    return db_type

@app.put("/data-types/{type_id}", response_model=type_schemas.DataType)
def update_data_type(type_id: int, data_type: type_schemas.DataTypeCreate, db: Session = Depends(get_db)):
    db_type = db.query(type_models.DataType).filter(type_models.DataType.id == type_id).first()
    if db_type is None:
        raise HTTPException(status_code=404, detail="Data type not found")
    
    for key, value in data_type.model_dump().items():
        setattr(db_type, key, value)
    
    try:
        db.commit()
        db.refresh(db_type)
        return db_type
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/data-types/{type_id}")
def delete_data_type(type_id: int, db: Session = Depends(get_db)):
    db_type = db.query(type_models.DataType).filter(type_models.DataType.id == type_id).first()
    if db_type is None:
        raise HTTPException(status_code=404, detail="Data type not found")
    
    try:
        db.delete(db_type)
        db.commit()
        return {"message": "Data type deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# Data Entry CRUD 操作
@app.post("/data-entries/", response_model=entry_schemas.DataEntry)
def create_data_entry(data_entry: entry_schemas.DataEntryCreate, db: Session = Depends(get_db)):
    # 验证 type 是否存在
    db_type = db.query(type_models.DataType).filter(type_models.DataType.name == data_entry.type).first()
    if not db_type:
        raise HTTPException(status_code=400, detail="Invalid data type")

    try:
        db_entry = entry_models.DataEntry(**data_entry.model_dump())
        db.add(db_entry)
        db.commit()
        db.refresh(db_entry)
        return db_entry
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/data-entries/", response_model=List[entry_schemas.DataEntry])
def read_data_entries(
    start_date: date | None = None,
    end_date: date | None = None,
    type: str | None = None,
    db: Session = Depends(get_db)
):
    try:
        query = db.query(entry_models.DataEntry)
        
        if start_date:
            query = query.filter(entry_models.DataEntry.date >= start_date)
        if end_date:
            query = query.filter(entry_models.DataEntry.date <= end_date)
        if type:
            query = query.filter(entry_models.DataEntry.type == type)
            
        return query.all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/data-entries/{entry_id}", response_model=entry_schemas.DataEntry)
def read_data_entry(entry_id: int, db: Session = Depends(get_db)):
    db_entry = db.query(entry_models.DataEntry).filter(entry_models.DataEntry.id == entry_id).first()
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Data entry not found")
    return db_entry

@app.put("/data-entries/{entry_id}", response_model=entry_schemas.DataEntry)
def update_data_entry(entry_id: int, data_entry: entry_schemas.DataEntryCreate, db: Session = Depends(get_db)):
    db_entry = db.query(entry_models.DataEntry).filter(entry_models.DataEntry.id == entry_id).first()
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Data entry not found")

    # 验证 type 是否存在
    db_type = db.query(type_models.DataType).filter(type_models.DataType.name == data_entry.type).first()
    if not db_type:
        raise HTTPException(status_code=400, detail="Invalid data type")
    
    try:
        for key, value in data_entry.model_dump().items():
            setattr(db_entry, key, value)
        db.commit()
        db.refresh(db_entry)
        return db_entry
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/data-entries/{entry_id}")
def delete_data_entry(entry_id: int, db: Session = Depends(get_db)):
    db_entry = db.query(entry_models.DataEntry).filter(entry_models.DataEntry.id == entry_id).first()
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Data entry not found")
    
    try:
        db.delete(db_entry)
        db.commit()
        return {"message": "Data entry deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))