import { createSlice } from '@reduxjs/toolkit'
import {
  addToCart,
  authUser,
  getCartItems,
  loginUser,
  logoutUser,
  payProducts,
  registerUser,
  removeCartItem,
} from './thunkFunctions'
import { toast } from 'react-toastify'

const initialState = {
  userData: {
    id: '',
    email: '',
    name: '',
    role: 0,
    image: '',
    cart: [],
  },
  cartDetail: [],
  isAuth: false,
  isLoading: false,
  error: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const startLoading = (state) => {
      state.isLoading = true
    }

    const endLoadingWithError = (state, action) => {
      state.isLoading = false
      state.error = action.payload
      toast.error(action.payload)
    }

    const setUserData = (state, action) => {
      state.isLoading = false
      state.userData = action.payload
      state.isAuth = true
    }

    builder
      // 회원가입
      .addCase(registerUser.pending, startLoading)
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false
        toast.info('WELCOME ~ SUCCESS!')
      })
      .addCase(registerUser.rejected, endLoadingWithError)

      // 로그인
      .addCase(loginUser.pending, startLoading)
      .addCase(loginUser.fulfilled, (state, action) => {
        setUserData(state, action)
        localStorage.setItem('accessToken', action.payload.accessToken)
      })
      .addCase(loginUser.rejected, endLoadingWithError)

      // 인증
      .addCase(authUser.pending, startLoading)
      .addCase(authUser.fulfilled, (state, action) => {
        state.isAuth = true // 인증 상태 설정
        state.userData = action.payload // 사용자 데이터 업데이트
        state.isLoading = false
      })
      .addCase(authUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.userData = initialState.userData
        state.isAuth = false
        localStorage.removeItem('accessToken')
      })

      // 로그아웃
      .addCase(logoutUser.pending, startLoading)
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.userData = initialState.userData
        state.isAuth = false
        localStorage.removeItem('accessToken')
      })
      .addCase(logoutUser.rejected, endLoadingWithError)

      // 장바구니 추가
      .addCase(addToCart.pending, startLoading)
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.userData.cart = action.payload
        toast.info('ADD TO CART')
      })
      .addCase(addToCart.rejected, endLoadingWithError)

      // 장바구니 조회
      .addCase(getCartItems.pending, startLoading)
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false
        state.cartDetail = action.payload
      })
      .addCase(getCartItems.rejected, endLoadingWithError)

      // 장바구니 아이템 제거
      .addCase(removeCartItem.pending, startLoading)
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.cartDetail = action.payload.productInfo
        state.userData.cart = action.payload.cart
        toast.info('REMOVE FROM CART')
      })
      .addCase(removeCartItem.rejected, endLoadingWithError)

      // 상품 결제
      .addCase(payProducts.pending, startLoading)
      .addCase(payProducts.fulfilled, (state) => {
        state.isLoading = false
        state.cartDetail = []
        state.userData.cart = []
        toast.info('SUCCESS BUY')
      })
      .addCase(payProducts.rejected, endLoadingWithError)
  },
})

export default userSlice.reducer
