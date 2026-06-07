import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/axios";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pesanan: 0,
    produk: 0,
    kategori: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pesananRes, produkRes, kategoriRes] = await Promise.all([
          api.get("/admin/pesanan"),
          api.get("/produk"),
          api.get("/kategori")
        ]);

        const totalPesanan = pesananRes.data?.data?.total || pesananRes.data?.data?.data?.length || 0;
        const totalProduk = produkRes.data?.data?.total || produkRes.data?.data?.data?.length || produkRes.data?.data?.length || 0;
        const totalKategori = kategoriRes.data?.data?.total || kategoriRes.data?.data?.data?.length || kategoriRes.data?.data?.length || 0;

        setStats({
          pesanan: totalPesanan,
          produk: totalProduk,
          kategori: totalKategori
        });
      } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen p-8 md:p-16">
      <div className="mb-12">
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 4vw, 4rem)", lineHeight: 1.1, textTransform: "uppercase", color: "var(--color-text-primary)" }}>
          Halo,<br/>{user?.nama || "Admin"}.
        </h2>
        <p className="mt-4 text-[11px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
          Selamat datang di Pusat Kendali Canvas Space
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link 
          to="/admin/pesanan" 
          className="p-8 group transition-all flex flex-col justify-between"
          style={{ border: "1px solid var(--color-text-primary)", background: "transparent", color: "var(--color-text-primary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-text-primary)"; e.currentTarget.style.color = "var(--color-text-inverted)"; e.currentTarget.style.boxShadow = "8px 8px 0 var(--color-text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-primary)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <div>
            <h3 className="text-2xl mb-4 font-bold" style={{ fontFamily: "var(--font-serif)" }}>Pesanan</h3>
            <p className="text-[10px] uppercase tracking-widest opacity-80">Kelola dan verifikasi pesanan masuk dari pelanggan.</p>
          </div>
          <div className="mt-8 text-4xl font-bold" style={{ fontFamily: "var(--font-mono)" }}>{stats.pesanan}</div>
        </Link>

        <Link 
          to="/admin/produk" 
          className="p-8 group transition-all flex flex-col justify-between"
          style={{ border: "1px solid var(--color-text-primary)", background: "transparent", color: "var(--color-text-primary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-text-primary)"; e.currentTarget.style.color = "var(--color-text-inverted)"; e.currentTarget.style.boxShadow = "8px 8px 0 var(--color-text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-primary)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <div>
            <h3 className="text-2xl mb-4 font-bold" style={{ fontFamily: "var(--font-serif)" }}>Produk</h3>
            <p className="text-[10px] uppercase tracking-widest opacity-80">Tambah, ubah, atau hapus katalog produk furniture.</p>
          </div>
          <div className="mt-8 text-4xl font-bold" style={{ fontFamily: "var(--font-mono)" }}>{stats.produk}</div>
        </Link>

        <Link 
          to="/admin/kategori" 
          className="p-8 group transition-all flex flex-col justify-between"
          style={{ border: "1px solid var(--color-text-primary)", background: "transparent", color: "var(--color-text-primary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-text-primary)"; e.currentTarget.style.color = "var(--color-text-inverted)"; e.currentTarget.style.boxShadow = "8px 8px 0 var(--color-text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-primary)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <div>
            <h3 className="text-2xl mb-4 font-bold" style={{ fontFamily: "var(--font-serif)" }}>Kategori</h3>
            <p className="text-[10px] uppercase tracking-widest opacity-80">Kelola klasifikasi kategori untuk setiap produk.</p>
          </div>
          <div className="mt-8 text-4xl font-bold" style={{ fontFamily: "var(--font-mono)" }}>{stats.kategori}</div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
