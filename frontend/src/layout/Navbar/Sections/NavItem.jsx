import React from 'react' // Importing React library
import { useDispatch, useSelector } from 'react-redux' // Importing Redux hooks
import { Link, useNavigate } from 'react-router-dom' // Importing React Router components
import { logoutUser } from '../../../store/thunkFunctions' // Importing logout action
import { AiOutlineShoppingCart } from 'react-icons/ai' // Importing shopping cart icon

// Defining routes for navigation menu
const routes = [
  { to: '/products', name: 'PRODUCTS', auth: null }, // Products menu (visible to everyone)
  { to: '/login', name: 'LOGIN', auth: false }, // Login menu (visible only to unauthenticated users)
  { to: '/register', name: 'REGISTER', auth: false }, // Register menu (visible only to unauthenticated users)
  {
    to: '/user/cart', // Link to cart
    name: '', // No name, only icon is shown
    auth: true, // Visible only to authenticated users
    icon: <AiOutlineShoppingCart style={{ fontSize: '1.4rem' }} />, // Shopping cart icon
  },
  { to: '/history', name: 'ORDER LIST', auth: true }, // Order list menu (visible only to authenticated users)
  { to: '/admin', name: 'ADMIN', auth: true, adminOnly: true }, // Admin menu (visible only to admins)
]

const NavItem = ({ mobile }) => {
  const isAuth = useSelector((state) => state.user?.isAuth) // Get authentication status from Redux state
  const role = useSelector((state) => state.user?.userData?.role) // Get user role from Redux state
  const cart = useSelector((state) => state.user?.userData?.cart) // Get cart data from Redux state

  const dispatch = useDispatch() // Initialize Redux dispatch function
  const navigate = useNavigate() // Initialize navigation function

  // Handle user logout
  const handleLogout = () => {
    dispatch(logoutUser()).then(() => { // Dispatch logout action
      navigate('/login') // Redirect to login page after logout
    })
  }

  return (
    <ul
      className={`navMenu ${mobile ? 'flex-col bg-gray-900 h-full' : ''} items-center`}
    >{/* Navigation menu container */}
      {routes.map(({ to, name, auth, icon, adminOnly }) => { // Iterate over route definitions
        if (auth !== null && isAuth !== auth) return null // Filter based on authentication status (null means visible to all)

        if (adminOnly && role !== 1) return null // Filter out non-admin users for admin-only routes

        return (
          <li key={name || to}> {/* Render each navigation item */}
            <Link to={to} className='navLink'> {/* Navigation link */}
              {icon} {/* Display icon if defined */}
              {name} {/* Display menu name */}
              {name === 'CART' && cart?.length > 0 && ( // Show cart count if there are items in the cart
                <span className='cartCount'>{cart.length}</span>
              )}
            </Link>
          </li>
        )
      })}

      {/* Logout button for authenticated users */}
      {isAuth && (
        <li key='LOGOUT'>
          <button onClick={handleLogout} className='navButton'> {/* Logout button */}
            LOGOUT
          </button>
        </li>
      )}
    </ul>
  )
}

export default NavItem // Export the NavItem component as default
