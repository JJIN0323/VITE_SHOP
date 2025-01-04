const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        console.log('Authorization Header:', authHeader) // 디버깅 로그
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.warn('Authorization header is missing or invalid')
            return res.status(401).json({ message: '인증 토큰이 없습니다.' })
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('Decoded Token:', decoded) // 디코딩 결과 확인

        const user = await User.findById(decoded.userId).select('-password')
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
        }

        req.user = user
        next()
    } catch (error) {
        console.error('Authentication Error:', error.message)
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.', error: error.message })
    }
}


module.exports = auth
