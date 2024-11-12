let createError = require('http-errors');
let express = require('express');
let path = require('path');
let port = 3000;

// // 프로메테우스 설치
// const { collectDefaultMetrics, register } = require('prom-client');
// // 기본 메트릭 수집
// collectDefaultMetrics();

// // handlebars  추가
// let session = require('express-session');
const handlebars = require('express-handlebars');

let indexRouter = require('./public/index.js');

let app = express();

// handlebars  설정
const hbs = handlebars.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'public/handlebars'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// 서버 시작
app.listen(port, () => {
  console.log(`frontend server on port ${port}`)
})


module.exports = app;
