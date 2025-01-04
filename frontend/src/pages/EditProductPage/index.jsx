import React, { useState, useEffect } from "react"
import axios from "axios"

const EditProductPage = () => {
  const [products, setProducts] = useState([]) // State to store the list of products
  const [loading, setLoading] = useState(true) // State to track loading status
  const [error, setError] = useState(null) // State to track any errors

  // Axios instance with base URL and authorization header
  const axiosInstance = axios.create({
    baseURL: "http://localhost:4000",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })

  // Fetch the list of products from the server
  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get("/products")
      setProducts(response.data.products || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load product data")
    } finally {
      setLoading(false)
    }
  }

  // Handle edit button click to navigate to edit form
  const handleEdit = (id) => {
    window.location.href = `/edit/${id}` // Redirect to the edit page for the specific product
  }

  // Fetch the products when the component is mounted
  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading) return <div style={{ textAlign: "center", marginTop: "20px" }}>Loading...</div>
  if (error) return <div style={{ textAlign: "center", color: "red", marginTop: "20px" }}>{error}</div>

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Products</h1> {/* Title of the page */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px", width: "50%" }}>NAME</th> {/* Product name */}
            <th style={{ border: "1px solid #ddd", padding: "8px", width: "20%" }}>PRICE</th> {/* Product price */}
            <th style={{ border: "1px solid #ddd", padding: "8px", width: "30%" }}>ACTION</th> {/* Action buttons */}
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    whiteSpace: "nowrap", // Ensure text stays in a single line
                    overflow: "hidden", // Hide overflowing text
                    textOverflow: "ellipsis", // Add ellipsis (...) for hidden text
                  }}
                >
                  {product.title}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center", // Center-align the text
                  }}
                >
                  {product.price}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center", // Center-align the text
                  }}
                >
                  <button
                    onClick={() => handleEdit(product._id)} // Trigger the edit action
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer", // Change cursor to pointer on hover
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "20px", border: "1px solid #ddd" }}>
                No products available {/* Message shown when there are no products */}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default EditProductPage
