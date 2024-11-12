// 현재 URL의 경로 가져오기
const path = window.location.pathname;

// 경로를 슬래시로 분리
const pathSegments = path.split('/');

// 마지막 값을 가져오기 (배열의 마지막 요소)
const lastSegment = pathSegments[pathSegments.length - 1];

// 마지막 값을 디코딩
const carnum = decodeURIComponent(lastSegment);

// console.log(`마지막 값: ${carnum}`);


window.addEventListener('DOMContentLoaded', async () => {
    try {
        const carnums = await carlist();
        displayCarList(carnums);
    } catch (e) {
        console.log(e);
        alert('차량 목록 조회 실패!');
    }
})

// 출차할 차량 선택 목록
const carlist = async () => {
    let url = `http://${sessionStorage.getItem('registerURL')}/carlists/${carnum}`;
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        return data;
    } else {
        throw new Error('차량 목록 조회 실패!!');
    }
    // dummyData = [
    //     { carnum: '12 가 1234', intime: '2024-10-01 10:00' },
    //     { carnum: '12 나 1234', intime: '2024-10-01 10:15' },
    //     { carnum: '12 다 1234', intime: '2024-10-01 10:30' },
    // ];
    // return dummyData
}

const displayCarList = (carnums) => {
    const carnumlist = document.querySelector('#carnumlist');

    let html = '';
    for ( const carnum of carnums) {
        html += `
        <tr>
            <td>
                <label>
                    <input type="radio" name="carLicense" value="${carnum.pno}" required>
                    ${carnum.carnum}
                </label>
            </td>
            <td>${carnum.intime}</td>
        </tr>
        `
    }
    carnumlist.innerHTML = html;
}

// 다음버튼 누르면 정산 내역으로 가기
const nextbtn = document.querySelector('#nextbtn');
const carnumfrm = document.forms['carnumfrm'];

nextbtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const selectedCar = document.querySelector('input[name="carLicense"]:checked');
    if (selectedCar) {
        const pno = selectedCar.value; // 선택된 차량 번호
        // console.log(`선택된 차량 번호: ${carnum}`);

        const formData = new FormData(carnumfrm);
        let jsondata = {};
        formData.forEach((val, key) => {
            jsondata[key] = val;
        });
        // console.log(jsondata);
        // window.location.href = `/paycheck/${encodeURIComponent(carnum)}`;

        try {
            // const res = await fetch(`http://127.0.0.1:8000/outregist/${carnum}`,
            //     {
            //         method: 'POST',
            //         headers: {
            //             'Accept': 'application/json',
            //             'Content-Type': 'application/json'
            //         },
            //         body: JSON.stringify(jsondata)
            //     })
            // // const result = await res.json();
            // if (res.ok) {
            //     window.location.href = "/views/visitor/paycheck.html";
            // } else {
            //     alert('출차 실패'); // 오류 메시지 출력
            // }

            let url = `http://${sessionStorage.getItem('registerURL')}/outregist/${pno}`;
            const res = await fetch(url);
            if (res.ok) {
                alert('출차되었습니다.');
                window.location.href = `/paycheck/${pno}`;
            } else {
                throw new Error('차량 목록 조회 실패!!');
            }
        } catch (error) {
            alert('출차 실패: 서버와 통신 중 오류가 발생했습니다.');
            console.error(error);
        }

    } else {
        alert('차량 번호를 선택해주세요!');
    }
})

