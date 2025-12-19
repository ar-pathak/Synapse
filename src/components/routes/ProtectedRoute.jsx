import { useEffect, useState } from "react";
import { isAuthenticatedUser } from "../../utils/auth";
import { Navigate } from "react-router";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setUserId, setUserinfo } from "../../store/slice/userinfoSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticatedUser();
        
        if (authenticated && authenticated.data) {
          setIsAuthenticated(authenticated.data.success);
          dispatch(setIsLoggedIn(authenticated.data.success));
          dispatch(setUserId(authenticated.data.id));
          dispatch(setUserinfo(authenticated.data.data))
        } else {
          setIsAuthenticated(false);
          dispatch(setIsLoggedIn(false));
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        dispatch(setIsLoggedIn(false));
      }
    };
    checkAuth();
  }, [dispatch]);
  if (isAuthenticated === false) {
    return <Navigate to="/auth/signin" />;
  }
  return children;
};

export default ProtectedRoute;
