import React from 'react'
import { Link } from 'react-router-dom'
import ImageSlider from '../../../components/ImageSlider'

const CardItem = ({ product }) => {
    return (
        <div className='cardImg'>
            <Link to={`/product/${product._id}`}>
            <ImageSlider images={product.images} />
                <p className='name'>{product.title}</p>
                <p className='description'>{product.description}</p>
                <p className='price'>{product.price}</p>
            </Link>
        </div>
    )
}

export default CardItem