import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg-base)" }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--color-text-primary)" }}>
          Memuat sesi...
        </p>
      </div>
    );
  }

  // Jika user sudah login, lempar menjauh dari halaman login/register
  if (user) {
    // Jika admin, lempar ke dashboard admin. Jika pelanggan, lempar ke beranda.
    if (user.role === "Admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // Jika belum login, izinkan akses ke halaman login/register
  return children;
};

export default GuestRoute;
