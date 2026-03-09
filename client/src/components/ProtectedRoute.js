import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // If not logged in → go to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If role is required but user role doesn't match → block access
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;


