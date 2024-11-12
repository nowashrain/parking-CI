// 현재 URL의 경로 가져오기
const path = window.location.pathname;

// 경로를 슬래시로 분리
const pathSegments = path.split('/');

// 마지막 값을 가져오기 (배열의 마지막 요소)
const pno = pathSegments[pathSegments.length - 1];

// 마지막 값을 디코딩
// let carnum = decodeURIComponent(lastSegment);
// let carnum = lastSegment;
// console.log(carnum);

// carnum = carnum.replace(/\s/g, '');

// console.log(`마지막 값: ${carnum}`);

window.addEventListener('DOMContentLoaded', async () => {
    try {

        const payment = await paylist();
        displayPayment(payment);

        // 버튼 클릭 이벤트 리스너 등록
        document.getElementById('confirmPaymentButton').addEventListener('click', function (event) {
            event.preventDefault();
            processPayment();
        });

    } catch(e) {
        console.log(e);
        alert('정산내역 조회 실패!');
    }
})

const paylist = async () => {
    // console.log(String(carnum));
    let url = `http://${sessionStorage.getItem('paymentURL')}/payment/${pno}`;
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        return data;
    } else {
        throw new Error('차량 목록 조회 실패!!');
    }
    // const dummyData = [
    //     {
    //         carnum: '12 가 1234',
    //         intime: '2024-10-01 10:00',
    //         outtime: '2024-10-01 12:00',
    //         paydate: '2시간',
    //         payment: '5,000원'
    //     }
    // ];
    // return dummyData;
    // console.log(carnum);
    // const url = `http://127.0.0.1:8001/payment`; // URL 수정
    // const res = await fetch(url, {
    //     method: 'POST', // POST 방식
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json' // JSON 형식
    //     },
    //     body: JSON.stringify({ "carnum" : carnum }) // carnum을 JSON 형태로 전달
    // });
    // if (res.ok) {
    //     const data = await res.json();
    //     return data;
    // } else {
    //     throw new Error('정산내역 조회 실패!!');
    // }
}


const displayPayment = (payment) => {
    const paytbody = document.querySelector('#paytbody');

    // 입차 및 출차 시간을 Date 객체로 변환
    const intime = new Date(payment.intime);
    const outtime = new Date(payment.outtime);

    // 주차 시간 계산 (분 단위)
    const diffMs = outtime - intime; // 밀리초 차이
    const diffMinutes = Math.ceil(diffMs / (1000 * 60)); // 분 단위로 변환하고 올림 처리 (10분 단위 요금 적용)

    // 주차 요금 계산
    const hourlyRate = 3000; // 1시간 요금
    const per10MinutesRate = 500; // 10분당 요금
    const hours = Math.floor(diffMinutes / 60); // 시간 부분
    const extraMinutes = diffMinutes % 60; // 나머지 분

    // 기본 요금은 1시간 단위 요금 * 시간
    let totalFee = hours * hourlyRate;

    // 추가 10분 단위 요금 계산
    if (extraMinutes > 0) {
        totalFee += Math.ceil(extraMinutes / 10) * per10MinutesRate;
    }

    // 주차 시간과 요금을 표시할 형식으로 변환
    const parkingDuration = `${Math.floor(diffMinutes / 60)}시간 ${diffMinutes % 60}분`;
    const feeFormatted = `${totalFee.toLocaleString()}원`; // 숫자 형식으로 변환

    // 시간 형식 변경 (시/분 단위로만 표시)
    const intimeFormatted = intime.toISOString().slice(0, 16).replace("T", " ");
    const outtimeFormatted = outtime.toISOString().slice(0, 16).replace("T", " ");

    let html = `
        <tr>
            <th>차량 번호</th>
            <td id="carLicense">${payment.carnum}</td>
        </tr>
        <tr>
            <th>입차 시간</th>
            <td id="entryTime">${intimeFormatted}</td>
        </tr>
        <tr>
            <th>출차 시간</th>
            <td id="exitTime">${outtimeFormatted}</td>
        </tr>
        <tr>
            <th>주차 시간</th>
            <td id="parkingDuration">${parkingDuration}</td>
        </tr>
        <tr>
            <th>요금 확인</th>
            <td id="fee">${feeFormatted}</td>
        </tr>
    `;
    paytbody.innerHTML = html;
}


const processPayment = async () => {
    var IMP = window.IMP;
    IMP.init('imp77608186');

    var feeElement = document.getElementById('fee');
    if (!feeElement) {
        alert('요금 정보가 없습니다.');
        return;
    }

    var amount = parseInt(feeElement.innerText.replace(/[^0-9]/g, ''), 10);
    var carLicense = document.getElementById('carLicense').innerText;

    try {
        // FastAPI 서버로 결제 데이터 전송
        const response = await fetch(`http://${sessionStorage.getItem('paymentURL')}/payment/complete`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                carnum: carLicense,
                payment: amount.toString(),
                // paydate: new Date().toISOString(),
                parkingtime: document.getElementById('parkingDuration').innerText
            })
        });

        if (!response.ok) {
            throw new Error('결제 데이터 저장 실패');
        }

        // 형식적인 아임포트 결제 요청
        IMP.request_pay({
            pg: 'html5_inicis',
            pay_method: 'card',
            merchant_uid: 'merchant_' + new Date().getTime(),
            name: '주차 요금 결제',
            amount: amount,
            buyer_email: 'test@example.com',
            buyer_name: '홍길동',
            buyer_tel: '010-1234-5678'
        }, function (rsp) {
            if (rsp.success) {
                alert('결제가 완료되었습니다.');
                window.location.href = '/';
            } else {
                alert('결제가 완료되었습니다.');
                window.location.href = '/';
            }
        });
    } catch (error) {
        alert('결제 데이터 저장 중 오류가 발생했습니다: ' + error.message);
    }
    // 에러확인
    // .then(response => response.json())
    // .then(data => {
    //     alert('결제 데이터가 저장되었습니다.');
    // })
    // .catch(error => {
    //    alert('FastAPI 서버와의 통신 중 오류가 발생했습니다.');
    //});

};