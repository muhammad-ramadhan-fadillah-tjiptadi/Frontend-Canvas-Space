import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading session...</p>
      </div>
    );
  }

  // Jika belum login, lempar ke halaman login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jika membutuhkan role tertentu (misal Admin) tapi role user tidak sesuai
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
