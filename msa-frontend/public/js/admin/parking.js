// import config from '../../../config.js';

window.addEventListener('load', async () => {
    try {
        const availableSpots = await getAvailableSpots();
        displayAvailableSpots(availableSpots);
    } catch (e) {
        console.error('차량 목록 조회 실패:', e); // 에러 로그 출력
        alert('차량 목록 조회 실패!'); // 사용자에게 알림
    }
});

// 남은 자리 수 가져오기
const getAvailableSpots = async () => {
    let url = `http://${sessionStorage.getItem('productURL')}/available-spots`;
    const res = await fetch(url);

    if (res.ok) {
        const data = await res.json();
        console.log(data);
        return {
            total_available_spots: data.total_available_spots || 100,
            used_spots: data.used_spots || 0
        };
    } else {
        throw new Error('남은 자리 수 fetch 실패!');
    }
};


const displayAvailableSpots = (availableSpots) => {
    const availableSpotsElement = document.querySelector('#available-spots');

    // availableSpots가 undefined일 경우 기본값으로 초기화
    const availableTotalSpots = availableSpots?.total_available_spots ?? 0;
    const usedSpots = availableSpots?.used_spots ?? 0;
    const remainingSpots = availableTotalSpots;

    console.log(`사용 중인 자리: ${usedSpots}, 남은 자리: ${remainingSpots}`);

    // HTML에 남은 자리 수와 사용 중인 자리 수 업데이트
    availableSpotsElement.innerHTML = `
        <div class="status-text" style="color:#ff6347">
            <b>사용 중인 자리: ${usedSpots}</b>
        </div>
        <div class="status-text" style="color:#32cd32">
            <b>남은 자리: ${remainingSpots}</b>
        </div>
    `;
};

// 주차 현황을 표시하는 함수
const displayParkingSpots = (availableSpots, usedParknums) => {
    const areas = ['A', 'B', 'C', 'D', 'E'];
    const spotsPerArea = 20;
    let index = 1;

    const usedSpotsSet = new Set(usedParknums);

    for (const area of areas) {
        const parkingSpotsContainer = document.getElementById(`${area}-parking-spots`);
        parkingSpotsContainer.innerHTML = ''; // 초기화

        for (let i = 0; i < spotsPerArea; i++) {
            const spot = document.createElement("div");
            spot.className = "parking-spot";

            // 사용 중인 자리인지 확인하여 색상 지정
            if (usedSpotsSet.has(index)) {
                spot.style.backgroundColor = "#ff6347"; // 사용 중 (빨간색)
            } else {
                spot.style.backgroundColor = "#32cd32"; // 비어 있음 (초록색)
            }

            parkingSpotsContainer.appendChild(spot);
            index++;
        }
    }

    // 장애인 주차 공간 처리
    const disabledParkingSpotsContainer = document.getElementById("F-disabled-parking-spots");
    disabledParkingSpotsContainer.innerHTML = '';

    const disabledUsedCount = 0;
    const totalDisabledSpots = 3;

    for (let j = 0; j < totalDisabledSpots; j++) {
        const disabledSpot = document.createElement("div");
        disabledSpot.className = "disabled-parking-spot";

        if (j < disabledUsedCount) {
            disabledSpot.style.backgroundColor = "#ff6347"; // 사용 중
        } else {
            disabledSpot.style.backgroundColor = "#0000ff"; // 비어 있음
        }

        disabledParkingSpotsContainer.appendChild(disabledSpot);
    }
};

// 서버에서 주차 현황 데이터를 가져오는 함수
const getStatus = async () => {
    const url = `http://${sessionStorage.getItem('productURL')}/status`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const availableSpots = {
            total_available_spots: data.total_available_spots,
            used_spots: data.used_spots,
        };

        const usedParknums = data.used_parknums;

        // 데이터가 로드된 후에만 displayParkingSpots 호출
        displayParkingSpots(availableSpots, usedParknums);
    } catch (error) {
        console.error('Error fetching parking status:', error);
    }
};

// 페이지 로드 시 상태 업데이트
window.onload = getStatus;







