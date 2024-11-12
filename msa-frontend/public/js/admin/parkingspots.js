//console.log('productURL:', `${sessionStorage.getItem('productURL')}`)
window.addEventListener('load', async () => {
    try {
        const parkseat = await getParkseatList();
        displayParkseatList(parkseat);
    } catch (e) {
        console.error('차량 목록 조회 실패:', e); // 에러 로그 출력
        alert('차량 목록 조회 실패!'); // 사용자에게 알림
    }
});

const getParkseatList = async () => {
    let url = `http://${sessionStorage.getItem('productURL')}/parkseat`;
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        return data;
    } else {
        throw new Error('차량 목록 fetch 실패!');
    }
};


const displayParkseatList = (parkseat) => {
    const parkseatlist = document.querySelector('#parkseat-list');
    console.log(parkseat);

    let html = '';
    for (const ps of parkseat) {
        html += `
        <tr class="text-center">
             <td>${ps.carnum}</td>
             <td>${ps.barrier ? 'O' : 'X'}</td>
        </tr>`
    }
    parkseatlist.innerHTML = html;
};








