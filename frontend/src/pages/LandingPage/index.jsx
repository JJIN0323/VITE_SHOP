import React, { useEffect, useState, useCallback } from 'react'
import CardItem from './Sections/CardItem'
import axiosInstance from '../../utils/axios'
import { Carousel } from 'react-responsive-carousel'

const LandingPage = () => {
  const limit = 4 // Number of products to fetch per request
  const [searchTerm, setSearchTerm] = useState('') // State for search input value
  const [products, setProducts] = useState([]) // State to store fetched products
  const [skip, setSkip] = useState(0) // State to keep track of pagination
  const [hasMore, setHasMore] = useState(false) // State to check if there are more products to load

  // Function to fetch products from the server
  const fetchProducts = useCallback(
    async ({ skip, limit, loadMore = false, filters = {}, searchTerm = '' }) => {
      const params = {
        skip, // Number of products to skip
        limit, // Maximum number of products to fetch
        filters, // Filters for product search
        searchTerm // Search term for product search
      }

      try {
        const response = await axiosInstance.get('/products', { params })

        if (loadMore) {
          // Append new products to the existing list
          setProducts((prevProducts) => [...prevProducts, ...response.data.products])
        } else {
          // Replace the current product list with fetched products
          setProducts(response.data.products)
        }
        setHasMore(response.data.hasMore) // Update whether more products are available
      } catch (error) {
        console.error(error) // Log the error if the request fails
      }
    },
    [] // Dependencies for useCallback
  )

  // Fetch products on component mount or when skip/limit changes
  useEffect(() => {
    fetchProducts({ skip, limit, searchTerm })
  }, [fetchProducts, skip, limit, searchTerm])

  // Handle search term input changes
  const handleSearchTerm = (event) => {
    const term = event.target.value // Get input value
    setSearchTerm(term) // Update searchTerm state

    const body = {
      skip: 0, // Reset pagination
      limit,
      searchTerm: term
    }
    setSkip(0) // Reset skip state
    fetchProducts(body) // Fetch products based on the new search term
  }

  // Handle 'Load More' button click
  const handleLoadMore = () => {
    const body = {
      skip: skip + limit, // Update skip value for pagination
      limit,
      loadMore: true,
      searchTerm
    }
    fetchProducts(body)
    setSkip(skip + limit) // Increment skip state
  }

  // Format price with ₩ and comma separators
  const formatPrice = (price) => {
    return `₩${new Intl.NumberFormat('ko-KR').format(price)}`
  }

  return (
    <section>
      {/* Main Image Carousel */}
      <div className='mainImg'>
        <Carousel showArrows={true} autoPlay={true} dynamicHeight={true} infiniteLoop={true}>
          <div>
            <img src='https://jjins0.cafe24.com/image/shop_img1.jpg' alt='Slide 1' />
          </div>
          <div>
            <img src='https://jjins0.cafe24.com/image/shop_img2.jpg' alt='Slide 2' />
          </div>
          <div>
            <img src='https://jjins0.cafe24.com/image/shop_img1.jpg' alt='Slide 3' />
          </div>
        </Carousel>
      </div>

      {/* Search Input */}
      <div className='search'>
        <input
          type='text'
          placeholder='Search products...' // Placeholder for search input
          value={searchTerm} // Controlled input value linked to searchTerm
          onChange={handleSearchTerm} // Trigger handleSearchTerm on input change
          className='border rounded-md p-2 mt-4'
        />
      </div>

      {/* Product Cards */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        {products.map((product) => (
          <CardItem
            product={{
              ...product,
              price: formatPrice(product.price) // Format price before passing it to CardItem
            }}
            key={product._id} // Unique key for each product
          />
        ))}
      </div>

      {/* Load More Button */}
      {/* {hasMore && (
        <div className='moreBtn'>
          <button
            onClick={handleLoadMore} // Trigger handleLoadMore on button click
            className='px-4 py-2 mt-5 text-white bg-black rounded-md hover:bg-gray-500'
          >
            MORE
          </button>
        </div>
      )} */}
    </section>
  )
}

export default LandingPage
