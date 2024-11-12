from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ParkingBase(BaseModel):
    carnum: str
    barrier: bool
    intime: datetime = datetime.now()
    outtime: Optional[datetime]


class Parking(ParkingBase):
    pno: int

    class Config:
        from_attributes=True
        json_encoders = {
            datetime: lambda v: v.strftime('%H:%M:%S')  # 출력 시 포맷 지정
        }

class ParkingList(BaseModel):
    pno: int
    carnum: str
    barrier: bool
    intime: datetime
    outtime: Optional[datetime]

    class Config:
        from_attributes=True
        json_encoders = {
            datetime: lambda v: v.strftime('%H:%M:%S')  # 출력 시 포맷 지정
        }

class ParkseatBase(BaseModel):
    carnum: str
    barrier: bool
    parknum: int


class ParkseatList(BaseModel):
    carnum: str
    barrier: bool

    class Config:
        from_attributes=True