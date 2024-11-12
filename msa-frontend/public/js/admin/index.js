console.log('happy');
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const cars = await visitedCars();
        displayCarList(cars);
    } catch (e) {
        console.log(e);
        alert('방문차량 목록 조회 실패!');
    }
})

// 방문 차량 조회 내역
const visitedCars = async () => {
    let url = `http://${sessionStorage.getItem('productURL')}/vehicles`;
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        return data;
    } else {
        throw new Error('차량 목록 조회 실패!!');
    }
    // dummyData = [
    //     { carnum: '12 가 1234', intime: '2024-10-01 10:00', outtime: '2024-10-02 10:00' },
    //     { carnum: '12 나 1234', intime: '2024-10-01 10:15', outtime: '2024-10-03 10:00' },
    //     { carnum: '12 다 1234', intime: '2024-10-01 10:30', outtime: '2024-10-04 10:00' },
    // ];
    // return dummyData
}

const displayCarList = (cars) => {
    const visitedtbody = document.querySelector('#visitedtbody');

    let html = '';
    for ( const car of cars) {
        html += `
        <tr class="text-center">
            <td>${car.carnum}</td>
            <td>${car.intime}</td>
            <td>${car.outtime ?? '주차중'}</td>
        </tr>
        `
    }
    visitedtbody.innerHTML = html;
}