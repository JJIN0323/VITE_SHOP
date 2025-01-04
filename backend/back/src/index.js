const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = 4000;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors({
    origin: 'http://localhost:5173', // 클라이언트 도메인
    credentials: true, // 인증 정보 허용
}));
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB 연결 완료');
    })
    .catch((err) => {
        console.error('MongoDB 연결 오류:', err);
    });

// 라우트 설정
app.use('/users', require('./routes/users'));
app.use('/products', require('./routes/products'));

// 에러 처리 미들웨어
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.send(error.message || '서버에서 에러가 발생했습니다.');
});
const log = require('loglevel');

// Node.js 환경에서는 기본 로그 레벨로 설정
log.setLevel('info');
log.info('Node.js 환경에서 기본 로그 레벨 설정 완료');


function isLocalStorageAvailable() {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        console.error('localStorage 사용 불가:', error);
        return false;
    }
}

// loglevel 초기화
if (isLocalStorageAvailable()) {
    const logLevel = localStorage.getItem('loglevel') || 'info';
    log.setLevel(logLevel);
} else {
    console.warn('localStorage를 사용할 수 없습니다. 기본 로그 레벨로 설정됩니다.');
    log.setLevel('info'); // 기본 로그 레벨 설정
}

// 이후 로그 출력 예제
log.info('애플리케이션 초기화 완료');

app.use(express.static(path.join(__dirname, '../uploads')));

app.listen(port, () => {
    console.log(`${port}번 포트에서 서버가 실행 중입니다.`);
});
