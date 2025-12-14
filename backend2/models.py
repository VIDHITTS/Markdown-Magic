from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from config.db import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    username = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    forks = relationship("Fork", back_populates="user", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String(36), primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    htmlCode = Column(Text, nullable=False, default="")
    cssCode = Column(Text, nullable=False, default="")
    jsCode = Column(Text, nullable=False, default="")
    isPublic = Column(Boolean, default=False)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    userId = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    user = relationship("User", back_populates="projects")
    
    likes = relationship("Like", back_populates="project", cascade="all, delete-orphan")
    forks = relationship("Fork", back_populates="project", cascade="all, delete-orphan")
    
    forkedFromId = Column(String(36), ForeignKey("projects.id", ondelete="SET NULL"))
    forkedFrom = relationship("Project", remote_side=[id], foreign_keys=[forkedFromId])

class Like(Base):
    __tablename__ = "likes"
    
    id = Column(String(36), primary_key=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    
    userId = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    projectId = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    
    user = relationship("User", back_populates="likes")
    project = relationship("Project", back_populates="likes")

class Fork(Base):
    __tablename__ = "forks"
    
    id = Column(String(36), primary_key=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    
    userId = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    projectId = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    
    user = relationship("User", back_populates="forks")
    project = relationship("Project", back_populates="forks")
