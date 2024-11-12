window.addEventListener('DOMContentLoaded', async () => {
    let url = `http://${sessionStorage.getItem('statisticsURL')}/statistics`;
    const res = await fetch(url);
    if (res.ok) {
        const data = await res.json();
        console.log(data);
        vData = data.visitordata.map(item => item.visitor_count); // 방문자 수만 추출
        fData = data.paymentdata.map(item => item.total_payment); // 총 결제 수만 추출

        // 그래프 생성
        createVisitorChart(vData);
        createFeeChart(fData);
    } else {
        throw new Error('차량 목록 조회 실패!!');
    }
});

function createVisitorChart(vData) {
    const visitorCtx = document.getElementById('visitorChart').getContext('2d');
    const visitorData = {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        datasets: [{
            label: '방문자 수',
            data: vData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }]
    };

    const visitorChart = new Chart(visitorCtx, {
        type: 'bar',
        data: visitorData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
                title: {
                    display: true,
                    text: '월별 방문자 수',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        },
    });
}

function createFeeChart(fData) {
    const feeCtx = document.getElementById('feeChart').getContext('2d');
    const feeData = {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        datasets: [{
            label: '요금 (만원)',
            data: fData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        }]
    };

    const feeChart = new Chart(feeCtx, {
        type: 'bar',
        data: feeData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
                title: {
                    display: true,
                    text: '월별 요금',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        },
    });
}
