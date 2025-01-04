import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utils/axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';

const DetailProductPage = () => {

  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axiosInstance.get(`/products/${productId}?type=single`);
        console.log(response);
        setProduct(response.data[0]);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProduct();
  }, [productId])

  if (!product) return null;

  return (
    <section>

      <div className='marginTopo'>
        <div className='productImg'>
          {/* ProductImage */}
          <ProductImage product={product} />
        </div>
        <div className='productInfo'>
          {/* ProductInfo */}
          <ProductInfo product={product} />
        </div>
      </div>

    </section>
  )
}

export default DetailProductPage