import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ requiredRole }) => {
  const isAuth = useSelector((state) => state.user?.isAuth); // Redux에서 직접 구독
  const role = useSelector((state) => state.user?.userData?.role); // Redux에서 직접 구독

  console.log("ProtectedRoutes Debug:");
  console.log("isAuth:", isAuth); // 확인
  console.log("role:", role);     // 확인
  console.log("requiredRole:", requiredRole); // 확인

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  if (requiredRole !== undefined && role !== requiredRole) {
    return <Navigate to="/not-authorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
