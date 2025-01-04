import React, { useState, useEffect } from 'react'
import axios from 'axios'

const EditSingleProductPage = ({ match }) => {
  const [product, setProduct] = useState(null) // State to store product details
  const [loading, setLoading] = useState(true) // State to track loading status
  const [error, setError] = useState(null) // State to track errors

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })

  // Fetch product details by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${match.params.id}`)
        setProduct(response.data)
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('Failed to load product data')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [match.params.id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      await axiosInstance.put(`/products/${product._id}`, product)
      alert('The product has been successfully updated')
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update the product')
    }
  }

  if (loading) return <div style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</div>
  if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '20px' }}>{error}</div>

  return (
    <div style={{ padding: '20px' }}>
      <h1>Edit Product</h1>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Title:{' '}
          <input
            type='text'
            name='title'
            value={product.title}
            onChange={handleInputChange}
            style={{ padding: '5px', width: '100%' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Description:{' '}
          <textarea
            name='description'
            value={product.description}
            onChange={handleInputChange}
            style={{ padding: '5px', width: '100%' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Price:{' '}
          <input
            type='number'
            name='price'
            value={product.price}
            onChange={handleInputChange}
            style={{ padding: '5px', width: '100%' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Quantity:{' '}
          <input
            type='number'
            name='quantity'
            value={product.quantity}
            onChange={handleInputChange}
            style={{ padding: '5px', width: '100%' }}
          />
        </label>
      </div>
      <button
        onClick={handleSave}
        style={{
          padding: '10px 20px',
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Save
      </button>
    </div>
  )
}

export default EditSingleProductPage
