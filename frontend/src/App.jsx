import { Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Navbar from './layout/Navbar'
import Footer from './layout/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authUser } from './store/thunkFunctions'
import ProtectedPage from './pages/ProtectedPage'
import ProtectedRoutes from './components/ProtectedRoutes'
import NotAuthRoutes from './components/NotAuthRoutes'
import HistoryPage from './pages/HistoryPage'
import CartPage from './pages/CartPage'
import DetailProductPage from './pages/DetailProductPage'
import UploadProductPage from './pages/UploadProductPage'
import AdminPage from './pages/AdminPage'
import ProductsPage from './pages/ProductsPage'
import EditProductPage from './pages/EditProductPage'
import EditSingleProductPage from './pages/EditSingleProductPage'
import DeleteProductPage from './pages/DeleteProductPage'

function App() {
  const dispatch = useDispatch()
  const isAuth = useSelector((state) => state.user?.isAuth)
  const role = useSelector((state) => state.user?.userData?.role)

  const { pathname } = useLocation()

  // Manage Navbar/Footer visibility using state
  const [hideLayout, setHideLayout] = useState(false)

  useEffect(() => {
    if (isAuth) {
      dispatch(authUser())
    }
  }, [isAuth, pathname, dispatch])

  // Hide layout and adjust styles for /admin pages
  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      setHideLayout(true)
    } else {
      setHideLayout(false)
    }
  }, [pathname])

  return (
    <>
      {/* Toast notifications */}
      <ToastContainer position='top-right' theme='light' style={{'zIndex':99999}} pauseOnHover autoClose={3500} />

      {/* Conditionally render Navbar and Footer */}
      {!hideLayout && <Navbar />}
      <main style={{ padding: hideLayout ? '0' : '20px' }}>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/product/:productId' element={<DetailProductPage />} />

          {/* Accessible only to authenticated users */}
          <Route element={<ProtectedRoutes isAuth={isAuth} />}>
            <Route path='/protected' element={<ProtectedPage />} />
            <Route path='/product/upload' element={<UploadProductPage />} />
            <Route path='/user/cart' element={<CartPage />} />
            <Route path='/history' element={<HistoryPage />} />
          </Route>

          {/* Admin-only protected routes */}
          <Route element={<ProtectedRoutes requiredRole={1} />}>
            <Route path='/admin' element={<AdminPage />} />
            <Route path="/product/delete" element={<DeleteProductPage />} />
            <Route path="/product/edit" element={EditProductPage} />
            <Route path="/product/edit/:id" element={EditSingleProductPage} />
          </Route>

          {/* Inaccessible to authenticated users */}
          <Route element={<NotAuthRoutes isAuth={isAuth} />}>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
          </Route>
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </>
  )
}

export default App
