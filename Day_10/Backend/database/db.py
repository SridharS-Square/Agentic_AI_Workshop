from sqlalchemy import create_engine, Column, String, Float, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config.settings import settings
import uuid
from datetime import datetime

Base = declarative_base()
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class StudentProfileDB(Base):
    __tablename__ = "student_profiles"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    resume_text = Column(Text, nullable=False)
    preferences = Column(JSON, nullable=False)
    linkedin_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class JobListingDB(Base):
    __tablename__ = "job_listings"
    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(JSON, nullable=False)
    location = Column(String, nullable=False)
    work_type = Column(String, nullable=False)
    source = Column(String, nullable=False)

class RelevanceScoreDB(Base):
    __tablename__ = "relevance_scores"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, nullable=False)
    student_id = Column(String, nullable=False)
    total_score = Column(Float, nullable=False)
    skill_match = Column(Float, nullable=False)
    culture_fit = Column(Float, nullable=False)
    goal_alignment = Column(Float, nullable=False)
    explanation = Column(Text, nullable=False)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()