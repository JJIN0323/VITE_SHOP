import React, { useState, useEffect } from 'react'
import axios from 'axios'

const DeleteProductPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Unauthorized. Please log in.')
      }

      const response = await axios.get('http://localhost:4000/products', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProducts(response.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setError(error.response?.data?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const refreshToken = async () => {
    try {
      const response = await axios.post('http://localhost:4000/auth/refresh-token', {
        refreshToken: localStorage.getItem('refreshToken')
      })
      const newToken = response.data.accessToken
      localStorage.setItem('token', newToken)
      return newToken
    } catch (error) {
      console.error('Failed to refresh token:', error)
      alert('Session expired. Please log in again.')
      return null
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:4000/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('The product has been successfully deleted')
      fetchProducts()
    } catch (error) {
      if (error.response?.status === 401) {
        const newToken = await refreshToken()
        if (newToken) {
          await axios.delete(`http://localhost:4000/products/${id}`, {
            headers: { Authorization: `Bearer ${newToken}` }
          })
          alert('The product has been successfully deleted after refreshing token')
          fetchProducts()
        }
      } else {
        console.error('Error deleting product:', error)
        alert('Failed to delete the product. Please try again.')
      }
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>

  return (
    <div>
      <h1>Delete Products</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.title}</td>
                <td>{product.price}</td>
                <td>
                  <button onClick={() => handleDelete(product._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='3'>No products available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DeleteProductPage
