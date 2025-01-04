import React from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../../store/thunkFunctions'

const ProductInfo = ({ product }) => {
  const dispatch = useDispatch()

  // Handle add to cart button click
  const handleClick = () => {
    dispatch(addToCart({ productId: product._id }))
  }

  return (
    <div>
      <h1 className='title'>INFOMATION</h1>

      <ul>
        <li>
          <span className='bold'>PRICE　#　</span>{product.price} 원
        </li>
        <li>
          <span className='bold'>SALE　#　</span>
          {product.quantity > 0 ? `${product.quantity} 개` : <span className='soldout'>　SOLD OUT</span>}
        </li>
        <li>
          <span className='bold'>VIEWS　#　</span>{product.views}
        </li>
        <hr />
        <li>
          <span className='bold'>DESCRIPTION　#</span>　{product.description}
        </li>
      </ul>
      <hr />
      <div>
        <button
          onClick={handleClick}
          className='skillBtn'
          disabled={product.quantity === 0} // Disable button if sold out
        >
          CART PAGE
        </button>
        <button disabled={product.quantity === 0}>BUY NOW</button>
      </div>
    </div>
  )
}

export default ProductInfo
