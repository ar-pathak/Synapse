import React, { useEffect, useState } from "react";
import { isAuthenticatedUser } from "../../utils/auth";
import { Navigate } from "react-router";
import { useDispatch } from "react-redux";
import { setIsLoggedIn } from "../../store/slice/userinfoSlice";

const PublicRoute = ({ children }) => {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticatedUser();
      setIsAuthenticated(authenticated.data.success);
      dispatch(setIsLoggedIn(authenticated.data.success));
    };
    checkAuth();
  }, [dispatch]);

  if (isAuthenticated === true) {
    return <Navigate to="/feed" />;
  }
  return children;
};

export default PublicRoute;
