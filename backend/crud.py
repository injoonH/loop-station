from sqlalchemy.orm import Session
from passlib.context import CryptContext

import models
import schemas

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_name(db: Session, name: str):
    return db.query(models.User).filter(models.User.name == name).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password.encode('utf-8'))

    db_user = models.User(name=user.name, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_user_audio(db: Session, audio: schemas.AudioCreate, user_id: int):
    db_audio = models.Audio(owner_id=user_id)
    db.add(db_audio)
    db.commit()
    db.refresh(db_audio)
    return db_audio
