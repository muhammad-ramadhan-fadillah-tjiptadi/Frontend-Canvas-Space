import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AdminSidebar from "./components/AdminSidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// Halaman Publik
import Home from "./pages/Home";
import DetailProduk from "./pages/DetailProduk";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Halaman Pelanggan
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Riwayat from "./pages/Riwayat";
import Profil from "./pages/Profil";

// Halaman Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminPesanan from "./pages/AdminPesanan";
import AdminProduk from "./pages/AdminProduk";
import AdminKategori from "./pages/AdminKategori";

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className={isAdminRoute ? "flex flex-col md:flex-row min-h-screen w-full" : "app-wrapper"} style={{ background: "var(--color-bg-base)", color: "var(--color-text-primary)" }}>
      {isAdminRoute ? <AdminSidebar /> : <Navbar />}
      
      <main className={isAdminRoute ? "flex-1 overflow-x-hidden bg-[var(--color-bg-base)]" : "main-content-area"}>
        <Routes>
          {/* Rute Publik */}
          <Route path="/" element={<Home />} />
          <Route path="/produk/:id" element={<DetailProduk />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rute Terproteksi: Pelanggan */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/riwayat" element={<ProtectedRoute><Riwayat /></ProtectedRoute>} />
          <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />

          {/* Rute Terproteksi: Khusus Admin */}
          <Route path="/admin" element={<ProtectedRoute roleRequired="Admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute roleRequired="Admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/pesanan" element={<ProtectedRoute roleRequired="Admin"><AdminPesanan /></ProtectedRoute>} />
          <Route path="/admin/produk" element={<ProtectedRoute roleRequired="Admin"><AdminProduk /></ProtectedRoute>} />
          <Route path="/admin/kategori" element={<ProtectedRoute roleRequired="Admin"><AdminKategori /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
