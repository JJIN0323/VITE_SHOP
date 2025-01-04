import axios from 'axios'

// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: import.meta.env.PROD
        ? ''
        : 'http://localhost:4000' // 환경에 따라 baseURL 설정
})

// 토큰 갱신 함수
const refreshToken = async () => {
    try {
        const response = await axios.post('/auth/refresh-token', {
            refreshToken: localStorage.getItem('refreshToken')
        })
        const newToken = response.data.accessToken
        localStorage.setItem('accessToken', newToken)
        console.log('새로운 토큰 저장:', newToken)
        return newToken
    } catch (error) {
        console.error('토큰 갱신 실패:', error)
        return null
    }
}

// Axios 응답 인터셉터: JWT 갱신 처리
axiosInstance.interceptors.response.use(
    (response) => response, // 성공 응답 그대로 반환
    async (error) => {
        if (error.response?.status === 401 && error.response?.data === 'jwt expired') {
            console.warn('JWT 토큰 만료. 갱신 시도 중...')
            const newToken = await refreshToken()
            if (newToken) {
                error.config.headers.Authorization = `Bearer ${newToken}`
                return axiosInstance.request(error.config) // 요청 재시도
            }
        }
        return Promise.reject(error)
    }
)

// Axios 요청 인터셉터: Authorization 헤더 설정
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
            console.log('Authorization Header:', config.headers.Authorization) // 디버깅용 로그
        } else {
            console.warn('JWT 토큰이 없습니다. 요청이 진행되지 않을 수 있습니다.')
        }
        return config
    },
    (error) => Promise.reject(error)
)

// 상품 조회수 업데이트 함수
const updateProductView = async (productId) => {
    try {
        const response = await axiosInstance.post(`/products/${productId}/views`)
        console.log('조회수 업데이트 성공:', response.data)
        return response.data // 업데이트된 조회수 반환
    } catch (error) {
        console.error('조회수 업데이트 실패:', error.response?.data || error.message)
        throw error
    }
}

// 상품 삭제 함수
const deleteProduct = async (productId) => {
    try {
        const response = await axiosInstance.delete(`/products/${productId}`)
        console.log('상품 삭제 성공:', response.data)
        return response.data // 삭제 결과 반환
    } catch (error) {
        console.error('상품 삭제 실패:', error.response?.data || error.message)
        throw error
    }
}

// Axios 인스턴스와 함수들 내보내기
export default axiosInstance
export { updateProductView, deleteProduct }
