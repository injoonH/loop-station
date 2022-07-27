from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str


class AudioBase(BaseModel):
    # name: str
    pass


class AudioCreate(AudioBase):
    audio_file: bytes


class Audio(AudioBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    name: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    audio_list: list[bytes] = []

    class Config:
        orm_mode = True
