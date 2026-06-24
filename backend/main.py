from datetime import date
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, inspect, text, Boolean, Column, Date, Integer, String
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from pydantic import BaseModel, ConfigDict, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Literal, Optional

BASE_DIR = Path(__file__).parent.resolve()


class Settings(BaseSettings):
    DATABASE_URL: str = f"sqlite:///{(BASE_DIR / 'todos.db').as_posix()}"

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env.local"),
        env_file_encoding="utf-8",
    )


settings = Settings()

# .env.local의 상대 경로(예: ./todos.db)를 main.py 위치 기준 절대 경로로 변환
_raw = settings.DATABASE_URL
if _raw.startswith("sqlite:///") and not _raw.startswith("sqlite:////"):
    _p = Path(_raw[len("sqlite:///"):])
    if not _p.is_absolute():
        _p = (BASE_DIR / _p).resolve()
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{_p.as_posix()}"
else:
    SQLALCHEMY_DATABASE_URL = _raw

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    completed = Column(Boolean, nullable=False, default=False)
    due_date = Column(Date, nullable=True)


Base.metadata.create_all(bind=engine)


def migrate_db() -> None:
    columns = [col["name"] for col in inspect(engine).get_columns("todos")]
    if "due_date" not in columns:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE todos ADD COLUMN due_date DATE"))
            conn.commit()


migrate_db()


class TodoCreate(BaseModel):
    title: str
    completed: bool = False
    due_date: date | None = None

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title must not be empty")
        return v


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
    due_date: date | None = None

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("title must not be empty")
        return v


class TodoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    completed: bool
    due_date: date | None


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Hello World"}


@app.get("/todos", response_model=list[TodoResponse])
def get_todos(
    filter_status: Literal["active", "completed"] | None = Query(
        default=None,
        alias="filter",
    ),
    search: str | None = Query(default=None, max_length=100),
    db: Session = Depends(get_db),
):
    query = db.query(Todo)
    if filter_status == "active":
        query = query.filter(Todo.completed.is_(False))
    elif filter_status == "completed":
        query = query.filter(Todo.completed.is_(True))
    search_text = search.strip() if search else ""
    if search_text:
        query = query.filter(Todo.title.ilike(f"%{search_text}%"))
    return query.all()


@app.post("/todos", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = Todo(**todo.model_dump())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    for key, value in todo.model_dump(exclude_unset=True).items():
        setattr(db_todo, key, value)
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
