// 차량 출차 - 4자리 차량 번호 입력
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
    // console.log(jsondata);
    // window.location.href = `./paycheck/carnum=${encodeURIComponent(carnum)}`; // 출차 페이지로 이동
    // alert('차량이 출차되었습니다.');
    window.location.href = `/outcar/${encodeURIComponent(carnum)}`;
    // try {
    //     const res = await fetch('http://127.0.0.1:8000/carregist',
    //         {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(jsondata)
    //         })
    //     const result = await res.json();
    //     if (res.ok) {
    //         // if (result.status === 'parking') {
    //             alert('차량이 등록되었습니다.');
    //         // } else if (result.status === 'exit') {
    //         //     // 출차 처리
    //         //     alert('차량이 출차되었습니다.');
    //         //     window.location.href = `./paycheck?carnum=${encodeURIComponent(carnum)}`; // 출차 페이지로 이동
    //         // }
    //     } else {
    //         alert('등록 실패: ' + result.message); // 오류 메시지 출력
    //     }
    // } catch (error) {
    //     alert('등록 실패: 서버와 통신 중 오류가 발생했습니다.');
    //     console.error(error);
    // }

})