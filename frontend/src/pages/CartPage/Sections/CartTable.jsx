import React from 'react';

const CartTable = ({ products = [], onRemoveItem }) => {

    const renderCartImage = (images = []) => {
        if (images.length > 0) {
            let image = images[0];
            return `${import.meta.env.VITE_SERVER_URL}/${image}`;
        }
        return ''; // Return an empty string if no images are available
    };

    const renderItems = (
        products.length > 0 
        ? products.map(product => (
            <tr key={product._id}>
                <td className='cartImg'>
                    <img
                        style={{ width: '100%' }}
                        alt={product.title}
                        src={renderCartImage(product.images)}
                    />
                </td>
                <td style={{textAlign:'center'}}>{products.length}</td>
                <td>{product.price} KRW</td>
                <td>
                    <button onClick={() => onRemoveItem(product._id)}>Remove</button>
                </td>
            </tr>
        ))
        : <tr><td colSpan="4">No items in cart</td></tr>
    );

    return (
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Remove</th>
                </tr>
            </thead>
            <tbody>
                {renderItems}
            </tbody>
        </table>
    );
};

export default CartTable;
