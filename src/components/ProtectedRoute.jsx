import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthContext } from '../App';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${location.pathname}${location.search}`);
    }
  }, [isAuthenticated, navigate, location]);
  
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;