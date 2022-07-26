import os
import bcrypt
from dotenv import load_dotenv
from sqlalchemy.orm import Session
import models
import schemas

load_dotenv()
salt_rounds = int(os.environ.get('SALT_ROUNDS'))


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    salt = bcrypt.gensalt(rounds=salt_rounds)
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), salt)

    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_user_audio(db: Session, audio: schemas.AudioCreate, user_id: int):
    # TODO: save audio file using audio.audio_file
    db_audio = models.Audio(name=audio.name, owner_id=user_id)
    db.add(db_audio)
    db.commit()
    db.refresh(db_audio)
    return db_audio
