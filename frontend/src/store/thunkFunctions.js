import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axios";

// 공통된 에러 처리 로직
const handleError = (error, thunkAPI) => {
  console.error("API Error:", error.message || error);
  return thunkAPI.rejectWithValue(error.response?.data || error.message);
};

// 회원가입
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (body, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(`/users/register`, body);
      console.log("Register Response:", data);
      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// 로그인
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (body, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(`/users/login`, body);
      console.log("Login Response:", data);
      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// 인증
export const authUser = createAsyncThunk(
  "user/authUser",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/users/auth`);
      console.log("Auth Response:", data); // role 값 확인
      return data; // response.data에 role 포함
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// 로그아웃
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(`/users/logout`);
      console.log("Logout Response:", data);
      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// 장바구니에 추가
export const addToCart = createAsyncThunk(
  "user/addToCart",
  async (body, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(`/users/cart`, body);
      console.log("Add to Cart Response:", data);
      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// 장바구니 아이템 가져오기
export const getCartItems = createAsyncThunk(
  "user/getCartItems",
  async ({ cartItemIds, userCart }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/products/${cartItemIds}?type=array`);

      // 아이템별 수량 매핑
      userCart.forEach((cartItem) => {
        data.forEach((productDetail, index) => {
          if (cartItem.id === productDetail._id) {
            data[index].quantity = cartItem.quantity;
          }
        });
      });

      console.log("Get Cart Items Response:", data);
      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// 장바구니 아이템 제거
export const removeCartItem = createAsyncThunk(
  "user/removeCartItem",
  async (productId, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(`/users/cart?productId=${productId}`);

      // 아이템별 수량 매핑
      data.cart.forEach((cartItem) => {
        data.productInfo.forEach((productDetail, index) => {
          if (cartItem.id === productDetail._id) {
            data.productInfo[index].quantity = cartItem.quantity;
          }
        });
      });

      console.log("Remove Cart Item Response:", data);
      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// 결제 처리
export const payProducts = createAsyncThunk(
  "user/payProducts",
  async (body, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(`/users/payment`, body);
      console.log("Pay Products Response:", data);
      return data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);
