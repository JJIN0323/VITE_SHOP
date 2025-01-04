import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCartItems, removeCartItem } from '../../store/thunkFunctions';
import CartTable from './Sections/CartTable';

const CartPage = () => {
  const userData = useSelector(state => state.user?.userData);
  const cartDetail = useSelector(state => state.user?.cartDetail);
  const isEmptyCart = cartDetail && cartDetail.length === 0;
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData?.cart && userData.cart.length > 0) {
      let cartItemIds = userData.cart.map(item => item.id);
      const body = {
        cartItemIds,
        userCart: userData.cart,
      };
      dispatch(getCartItems(body));
    }
  }, [userData, dispatch]);

  if (isEmptyCart) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Your cart is empty!</div>;
  }

  return (
    <div>
      <h1 className='title'>My Cart</h1>
      <CartTable products={cartDetail} onRemoveItem={(id) => dispatch(removeCartItem(id))} />
    </div>
  );
};

export default CartPage;
