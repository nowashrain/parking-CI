var express = require('express');
var router = express.Router();

// 프로메테우스 설치
const { collectDefaultMetrics, register } = require('prom-client');
// 기본 메트릭 수집
collectDefaultMetrics();

// handlebars REST API 서버 주소 등록
const registerURL = process.env.REGIST_SRV_URL || '127.0.0.1';
const productURL = process.env.PRODUCT_SRV_URL || '127.0.0.1';
const paymentURL = process.env.PAYMENT_SRV_URL || '127.0.0.1';
const statisticsURL = process.env.STATISTICS_SRV_URL || '127.0.0.1';

// 프로메테우스 메트릭 엔드포인트 설정
router.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.sendFile(__dirname + '/views/visitor/index.html');
  res.render('index', {registerURL: registerURL, productURL: productURL, paymentURL: paymentURL, statisticsURL: statisticsURL, layout: false})
});

router.get('/leaving', function(req, res, next) {
  res.sendFile(__dirname + '/views/visitor/leaving.html');
});

router.get('/register', function(req, res, next) {
  res.sendFile(__dirname + '/views/visitor/register.html');
});

router.get('/paycheck/:carnum', function(req, res, next) {
  res.sendFile(__dirname + '/views/visitor/paycheck.html');
});

router.get('/outcar/:carnum', function(req, res, next) {
  res.sendFile(__dirname + '/views/visitor/outcar.html');
});

/* admin */
router.get('/admin', function(req, res, next) {
  // res.sendFile(__dirname + '/views/admin/index.html');
  res.render('adminindex', {registerURL: registerURL, productURL: productURL, paymentURL: paymentURL, statisticsURL: statisticsURL, layout: false})
});

router.get('/admin/parking', function(req, res, next) {
  res.sendFile(__dirname + '/views/admin/parking.html');
});

router.get('/admin/parkingspots', function(req, res, next) {
  res.sendFile(__dirname + '/views/admin/parkingspots.html');
});

router.get('/admin/payment', function(req, res, next) {
  res.sendFile(__dirname + '/views/admin/payment.html');
});

router.get('/admin/statistics', function(req, res, next) {
  res.sendFile(__dirname + '/views/admin/statistics.html');
});


module.exports = router;
