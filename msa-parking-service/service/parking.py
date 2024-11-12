from datetime import datetime

from sqlalchemy.orm import Session

from models.parking import Parking, Parkseat
from schema.parking import ParkingBase, ParkseatBase

TOTAL_SPOTS = 100



def vehiclelist(db: Session):
    return db.query(Parking.carnum, Parking.barrier, Parking.intime, Parking.outtime,
                    Parking.pno).order_by(Parking.pno.desc()).all()


def parkseatlist(db: Session):
    return db.query(Parkseat.carnum,
                    Parkseat.barrier).order_by(Parkseat.carnum.desc()).all()


def get_available_spots(db: Session):
    # 주차된 차량의 총 수 조회
    total_parked = db.query(Parkseat).count()

    # 남은 자리 수 계산
    available_spots = TOTAL_SPOTS - total_parked

    return {
        "total_available_spots": available_spots,
        "used_spots": total_parked
    }
