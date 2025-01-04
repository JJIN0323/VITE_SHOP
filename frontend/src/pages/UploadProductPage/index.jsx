import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import axiosInstance from '../../utils/axios'
import { useNavigate } from 'react-router-dom'
import FileUpload from '../../components/FileUpload'

const continents = [
  { key: 1, value: 'Chair' },
  { key: 2, value: 'Plant' },
  { key: 3, value: 'ETC' },
]

const UploadProductPage = () => {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: 0,
    quantity: 0, // 상품 수량
    images: [],
  })

  const userData = useSelector((state) => state.user?.userData)
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleImages = (newImages) => {
    setProduct((prevState) => ({
      ...prevState,
      images: newImages,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const body = {
      writer: userData.id,
      role: userData.role, // role 추가
      ...product,
    }

    try {
      console.log('Payload:', body) // 디버깅용
      const response = await axiosInstance.post('/products', body) // 요청 경로 유지
      console.log('Response:', response.data)
      navigate('/products') // 리다이렉트 경로 변경
    } catch (error) {
      console.error('상품 업로드 실패:', error.response?.data || error.message)
    }
  }

  return (
    <section className='flexContact'>
      <form className='uploadPage' onSubmit={handleSubmit}>
        <FileUpload images={product.images} onImageChange={handleImages} />

        <div>
          <label htmlFor='title'>SUBJECT</label>
          <input
            className='inputFeild'
            name='title'
            id='title'
            onChange={handleChange}
            value={product.title}
          />
        </div>

        <div>
          <label htmlFor='description'>DESCRIPTION</label>
          <input
            className='inputFeild'
            name='description'
            id='description'
            onChange={handleChange}
            value={product.description}
          />
        </div>

        <div>
          <label htmlFor='quantity'>QUANTITY</label>
          <input
            className='inputFeild'
            type='number'
            name='quantity'
            id='quantity'
            onChange={handleChange}
            value={product.quantity}
            min='0'
          />
        </div>
        
        <div>
          <label htmlFor='price'>
            PRICE {product.quantity === 0 && '(Sold Out)'}
          </label>
          <input
            className='inputFeild'
            type='number'
            name='price'
            id='price'
            onChange={handleChange}
            value={product.price}
            disabled={product.quantity === 0} // 수량이 0일 때 가격 변경 불가
          />
        </div>

        <div>
          <label htmlFor='continents'>CATEGORY</label>
          <select
            className='inputFeild'
            name='continents'
            id='continents'
            onChange={handleChange}
            value={product.continents}
          >
            {continents.map((item) => (
              <option key={item.key} value={item.key}>
                {item.value}
              </option>
            ))}
          </select>
        </div>

        <div className='mt-4'>
          <button type='submit' className='submit'>
            UPLOAD
          </button>
        </div>
      </form>
    </section>
  )
}

export default UploadProductPage
