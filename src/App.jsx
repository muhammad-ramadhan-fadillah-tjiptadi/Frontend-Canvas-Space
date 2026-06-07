import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
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
import AdminPesanan from "./pages/AdminPesanan";
import AdminProduk from "./pages/AdminProduk";
import AdminKategori from "./pages/AdminKategori";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />
          
          <main className="main-content-area">
            <Routes>
              {/* Rute Publik */}
              <Route path="/" element={<Home />} />
              <Route path="/produk/:id" element={<DetailProduk />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rute Terproteksi: Pelanggan */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/riwayat"
                element={
                  <ProtectedRoute>
                    <Riwayat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profil"
                element={
                  <ProtectedRoute>
                    <Profil />
                  </ProtectedRoute>
                }
              />

              {/* Rute Terproteksi: Khusus Admin */}
              <Route
                path="/admin/pesanan"
                element={
                  <ProtectedRoute roleRequired="Admin">
                    <AdminPesanan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/produk"
                element={
                  <ProtectedRoute roleRequired="Admin">
                    <AdminProduk />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/kategori"
                element={
                  <ProtectedRoute roleRequired="Admin">
                    <AdminKategori />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
