from fastapi import File
from pydantic import BaseModel


class AudioBase(BaseModel):
    name: str


class AudioCreate(AudioBase):
    audio_file: bytes


class Audio(AudioBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    audio_list: list[bytes] = []

    class Config:
        orm_mode = True
