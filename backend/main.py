import os
import json
from datetime import datetime, timedelta

from dotenv import load_dotenv
from fastapi import Body, Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from passlib.context import CryptContext

import crud
import models
import schemas
from database import SessionLocal, engine

load_dotenv()
jwt_secret_key = os.environ.get('JWT_SECRET_KEY')
jwt_algorithm = os.environ.get('JWT_ALGORITHM')
jwt_access_token_expire_min = int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRE_MIN'))

models.Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')

app = FastAPI()

origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def authenticate_user(db, username: str, password: str):
    db_user = crud.get_user_by_name(db, username)
    if not db_user:
        return False
    if not pwd_context.verify(password, db_user.hashed_password):
        return False
    return db_user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, jwt_secret_key, algorithm=jwt_algorithm)
    return encoded_jwt


async def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Could not validate credentials',
        headers={'WWW-Authenticate': 'Bearer'}
    )
    
    try:
        payload = jwt.decode(token, jwt_secret_key, algorithms=[jwt_algorithm])
        username: str = payload.get('sub')
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_name(db, name=token_data.username)
    if user is None:
        raise credentials_exception
    return user


@app.post('/token', response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
            headers={'WWW-Authenticate': 'Bearer'}
        )
    access_token_expires = timedelta(minutes=jwt_access_token_expire_min)
    access_token = create_access_token(
        data={'sub': user.name},
        expires_delta=access_token_expires
    )
    return {'access_token': access_token, 'token_type': 'bearer'}


@app.post('/users/', response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail='Email already registered')
    return crud.create_user(db=db, user=user)


# @app.get('/users/{user_id}', response_model=schemas.User)
# async def read_user(
#     user_id: int,
#     db: Session = Depends(get_db)
# ):
#     db_user = crud.get_user(db, user_id=user_id)
#     if db_user is None:
#         raise HTTPException(status_code=404, detail='User not found')
#     return db_user


@app.get('/users/me', response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user


@app.post('/users/{user_id}/audio/', response_model=schemas.Audio)
async def create_audio_for_user(
    user_id: int,
    audio: bytes = Body(),
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    data = json.loads(audio.decode('utf-8'))
    audio_list = data['audio']
    bytes_audio_list = bytes(audio_list)
    
    with open('myaudio.wav', mode='bx') as f:
        f.write(bytes_audio_list)
    
    return crud.create_user_audio(db=db, audio=audio, user_id=user_id)
