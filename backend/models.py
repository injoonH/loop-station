from enum import unique
from sqlalchemy import BLOB, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(31), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(63))

    audio_list = relationship('Audio', back_populates='owner')


class Audio(Base):
    __tablename__ = 'audio'

    id = Column(Integer, primary_key=True, index=True)
    # name = Column(String(31))
    owner_id = Column(Integer, ForeignKey('users.id'))

    owner = relationship('User', back_populates='audio_list')
