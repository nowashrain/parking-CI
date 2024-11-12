from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.orm import Session

from schema.parking import ParkingBase, Parking, ParkingList, ParkseatList
from service.database import get_db
from service.parking import vehiclelist, parkseatlist
from models.parking import Parkseat

router = APIRouter()


TOTAL_SPOTS = 100


@router.get('/vehicles', response_model=list[ParkingList])
async def list_vehicle(db: Session = Depends(get_db)):
    parkings = vehiclelist(db)

    return [ParkingList.model_validate(p) for p in parkings]


@router.get('/parkseat', response_model=list[ParkseatList])
async def list_parkseat(db: Session = Depends(get_db)):
    parkseat = parkseatlist(db)

    return [ParkseatList.model_validate(ps) for ps in parkseat]


@router.get("/available-spots")
async def get_available_spots(db: Session = Depends(get_db)):
    # 전체 사용 중인 자리 수
    total_occupied = db.query(Parkseat).count()

    # 남은 자리 계산
    total_available_spots = TOTAL_SPOTS - total_occupied
    print("hello", total_available_spots)

    # 결과 반환
    return {
        "total_available_spots": total_available_spots,
        "used_spots": total_occupied  # 사용 중인 자리 수 추가
    }

@router.get("/status")
def get_parking_status(db: Session = Depends(get_db)):
    total_spots = 100  # 주차장의 총 자리 수
    used_spots_query = db.query(Parkseat.parknum).all()

    # 사용 중인 parknum 리스트 생성
    used_parknums = [spot.parknum for spot in used_spots_query]
    used_spots = len(used_parknums)  # 사용 중인 자리 수

    # JSON 형태로 데이터를 반환
    return {
        "total_available_spots": total_spots,
        "used_spots": used_spots,
        "used_parknums": used_parknums
    }