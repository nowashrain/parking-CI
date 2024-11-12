window.addEventListener('DOMContentLoaded', async () => {
    try {
        await remainCar();
    } catch (e) {
        console.log(e);
        alert('남은 주차 자리수 조회 실패!');
    }
})

// 남은 주차자리 수
const remainCar = async () => {
    let url =  `http://${sessionStorage.getItem('productURL')}/available-spots`
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        const remainCars = document.querySelector('#remainCars');
        // const remainBarrier = document.querySelector('#remainBarrier');

        if (data) {

            let html = `${data.used_spots || 0}/${data.total_available_spots+data.used_spots || 0}`;
            // let html = `${data.total_available_spots || 0}`; // 장애인석도 포함할 경우
            // let html1 = `50/100`;
            remainCars.innerHTML = html;
        }else{
            console.log('no')
        }

        // let html2 = `${data.remainBarrier}/2`;
        // let html2 = `1/2`;
        // remainBarrier.innerHTML = html2;
    // }
}

// 차량 등록
const regbtn = document.querySelector('#regbtn');
const carnumfrm = document.forms['carnumfrm'];
let carnum = '';

regbtn.addEventListener('click', async (event) => {
    event.preventDefault();
    carnum = document.querySelector('#carnum').value;

    const formData = new FormData(carnumfrm);

    let jsondata = {};
    formData.forEach((val, key) => {
        jsondata[key] = val;
    });
    // alert('차량이 등록되었습니다.');
    // window.location.href = '/views/visitor/index.html';
    try {
        const res = await fetch(`http://${sessionStorage.getItem('registerURL')}/carregist`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsondata)
            })
        const result = await res.json();
        if (res.ok) {
            // if (result.status === 'parking') {
            alert('차량이 등록되었습니다.');
            window.location.href = '/';
            // } else if (result.status === 'exit') {
            //     // 출차 처리
            //     alert('차량이 출차되었습니다.');
            //     window.location.href = `./paycheck?carnum=${encodeURIComponent(carnum)}`; // 출차 페이지로 이동
            // }
        } else {
            alert('등록 실패: ' + result.message); // 오류 메시지 출력
        }
    } catch (error) {
        alert('등록 실패: 서버와 통신 중 오류가 발생했습니다.');
        console.error(error);
    }

})};