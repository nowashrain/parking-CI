window.addEventListener('DOMContentLoaded', async () => {
    try {
        const pays = await paylist();
        displayCarList(pays);
    } catch (e) {
        console.log(e);
        alert('결제내역 목록 조회 실패!');
    }
})

// 결제 내역 조회
const paylist = async () => {
    let url = `http://${sessionStorage.getItem('statisticsURL')}/paymentlist`;
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        if (data) {
            return data;
        } else {
            alert('결제내역이 없습니다.');
        }

    } else {
        throw new Error('결제 내역 목록 조회 실패!!');
    }
    // dummyData = [
    //     { payid: '01', carnum: '12가1234', payment: '30000', paydate: '2024-10-02 10:00' },
    //     { payid: '02', carnum: '12나1234', payment: '30400', paydate: '2024-10-03 10:00' },
    //     { payid: '03', carnum: '12다1234', payment: '53000', paydate: '2024-10-04 10:00' },
    // ];
    // return dummyData
}

const displayCarList = (pays) => {
    const paytbody = document.querySelector('#paytbody');

    let html = '';
    for ( const pay of pays) {
        html += `
        <tr class="text-center">
            <td>${pay.payid}</td>
            <td>${pay.carnum}</td>
            <td>${pay.payment}원</td>
            <td>${pay.paydate}</td>
        </tr>
        `
    }
    paytbody.innerHTML = html;
}