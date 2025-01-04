import React, { useEffect, useState, useCallback } from 'react'
import CardItem from '../LandingPage/Sections/CardItem'
import axiosInstance from '../../utils/axios'

const ProductsPage = () => {
  const limit = 4 // Number of products to fetch per request
  const [searchTerm, setSearchTerm] = useState('') // State to store the search input value
  const [products, setProducts] = useState([]) // State to store the list of products
  const [skip, setSkip] = useState(0) // State to track the number of products skipped for pagination
  const [hasMore, setHasMore] = useState(false) // State to check if there are more products to load

  // Function to fetch products from the server
  const fetchProducts = useCallback(
    async ({ skip, limit, loadMore = false, filters = {}, searchTerm = '' }) => {
      const params = {
        skip, // Number of products to skip
        limit, // Maximum number of products to fetch
        filters, // Filters for product search
        searchTerm // Search term for filtering products
      }

      try {
        const response = await axiosInstance.get('/products', { params })

        if (loadMore) {
          // Append new products to the existing list
          setProducts((prevProducts) => [...prevProducts, ...response.data.products])
        } else {
          // Replace the product list with new products
          setProducts(response.data.products)
        }
        setHasMore(response.data.hasMore) // Update the state to reflect if more products are available
      } catch (error) {
        console.error(error) // Log the error if the request fails
      }
    },
    [] // Dependencies for useCallback, no dependencies mean it won't change
  )

  // Fetch products when the component mounts or when skip/limit changes
  useEffect(() => {
    fetchProducts({ skip, limit, searchTerm })
  }, [fetchProducts, limit, searchTerm])

  // Function to handle search term changes
  const handleSearchTerm = (event) => {
    const term = event.target.value // Get the value from the input field
    setSearchTerm(term) // Update the searchTerm state

    const body = {
      skip: 0, // Reset pagination
      limit,
      searchTerm: term
    }
    setSkip(0) // Reset the skip state
    fetchProducts(body) // Fetch products based on the new search term
  }

  // Format the price to include ₩ and use comma separators
  const formatPrice = (price) => {
    return `₩${new Intl.NumberFormat('ko-KR').format(price)}`
  }

  return (
    <section>

      {/* Search Input */}
      <div className="search" style={{ margin: '7rem 0 3rem 0' }}>
        <input
          type="text"
          placeholder="Search products..." // Placeholder text for the input field
          value={searchTerm} // Controlled input linked to searchTerm state
          onChange={handleSearchTerm} // Trigger handleSearchTerm on input change
          className="border rounded-md p-2 w-full mb-4"
        />
      </div>

      {/* Product Cards */}
      <div>
        {products.map((product) => (
          <CardItem
            product={{
              ...product,
              price: formatPrice(product.price) // Format the price before passing it to CardItem
            }}
            key={product._id}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="moreBtn">
          <button
            onClick={() =>
              fetchProducts({ skip: skip + limit, limit, loadMore: true, searchTerm })
            }
          >
            MORE
          </button>
        </div>
      )}
    </section>
  )
}

export default ProductsPage
