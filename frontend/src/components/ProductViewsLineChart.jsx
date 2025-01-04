import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import axiosInstance from '../utils/axios'

function ProductViewsLineChart() {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('API 요청 시작 - /products/views')

        // API 호출
        const response = await axiosInstance.get('/products/views')
        console.log('API 응답 데이터:', JSON.stringify(response.data, null, 2))

        const products = response.data

        if (!products || products.length === 0) {
          console.error('응답 데이터가 비어 있습니다.')
          setLoading(false)
          return
        }

        // 차트 데이터 생성
        const data = {
          labels: products.map(product => product.title),
          datasets: [
            {
              label: '조회수',
              data: products.map(product => product.views),
              fill: false,
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.1
            },
          ],
        }

        setChartData(data)
      } catch (error) {
        console.error('API 요청 실패 - /products/views')
        if (error.response) {
          console.error('응답 상태 코드:', error.response.status)
          console.error('응답 데이터:', JSON.stringify(error.response.data, null, 2))
        } else {
          console.error('네트워크 또는 기타 에러:', error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <p>로딩 중...</p>
  }

  if (!chartData) {
    return <p>데이터를 불러오지 못했습니다.</p>
  }

  return (
    <div>
      <h2>상품 조회수 선 그래프</h2>
      <Line data={chartData} options={{ responsive: true }} />
    </div>
  )
}

export default ProductViewsLineChart
