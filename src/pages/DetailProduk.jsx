import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";
import api from "../api/axios";

const DetailProduk = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kuantitas, setKuantitas] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/produk/${id}`);
        setProduk(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil detail produk:", error);
        setErrorMsg("Produk tidak ditemukan atau telah dihapus.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleTambahKeranjang = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (kuantitas > produk.stok) {
      setErrorMsg("Kuantitas melebihi stok yang tersedia!");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }

    addToCart(produk, kuantitas);
    setSuccessMsg(`Berhasil menambahkan ${kuantitas} item ke keranjang.`);
    
    setTimeout(() => {
      setSuccessMsg("");
    }, 4000);
  };

  const handleKuantitasChange = (amount) => {
    const val = kuantitas + amount;
    if (val >= 1 && val <= produk.stok) {
      setKuantitas(val);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg-base)" }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--color-text-primary)" }}>
          Memuat Detail...
        </p>
      </div>
    );
  }

  if (errorMsg && !produk) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: "var(--color-bg-base)" }}>
        <p className="text-[11px] font-bold uppercase tracking-widest text-red-500">{errorMsg}</p>
        <Link to="/" className="text-[10px] font-bold uppercase tracking-widest border-b" style={{ color: "var(--color-text-primary)", borderColor: "var(--color-text-primary)" }}>Kembali ke Beranda</Link>
      </div>
    );
  }

  const imageSrc = produk.gambar
    ? produk.gambar.startsWith("http")
      ? produk.gambar
      : `http://localhost:8000${produk.gambar}`
    : "https://via.placeholder.com/600x400?text=No+Image";

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative pt-16 md:pt-0" style={{ background: "var(--color-bg-base)", color: "var(--color-text-primary)" }}>
      
      {/* Toast Notification */}
      <div 
        className={`fixed top-24 right-8 z-50 transition-all duration-500 transform ${successMsg ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}
      >
        <div className="px-6 py-4 flex flex-col gap-3" style={{ background: "var(--color-bg-base)", border: "1px solid var(--color-text-primary)", boxShadow: "4px 4px 0 var(--color-text-primary)" }}>
          <div className="flex items-center gap-4">
            <span style={{ color: "#10b981", fontSize: "12px" }}>■</span>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-primary)" }}>
              {successMsg}
            </span>
          </div>
          <Link to="/cart" className="text-[9px] font-bold uppercase tracking-widest self-end" style={{ borderBottom: "1px solid var(--color-text-primary)", color: "var(--color-text-primary)" }}>
            Lihat Keranjang →
          </Link>
        </div>
      </div>

      {/* Toast Error */}
      <div 
        className={`fixed top-24 right-8 z-50 transition-all duration-500 transform ${errorMsg && produk ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}
      >
        <div className="px-6 py-4 flex items-center gap-4" style={{ background: "var(--color-bg-base)", border: "1px solid #ef4444", boxShadow: "4px 4px 0 #ef4444" }}>
          <span style={{ color: "#ef4444", fontSize: "12px" }}>■</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">
            {errorMsg}
          </span>
        </div>
      </div>

      {/* Left side: Image */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative h-[50vh] md:h-screen md:sticky md:top-0 border-b md:border-b-0 md:border-r" style={{ borderColor: "var(--color-border-subtle)", zIndex: 1 }}>
        <img 
          src={imageSrc} 
          alt={produk.nama_produk} 
          className="w-full max-h-[90%] object-contain grayscale transition-all duration-700 hover:grayscale-0 translate-y-8 md:translate-y-9"
          style={{ mixBlendMode: "multiply" }}
        />
      </div>

      {/* Right side: Info */}
      <div className="w-full md:w-1/2 flex flex-col p-8 md:p-16 lg:p-24 relative overflow-y-auto">
        <Link to="/" className="text-[9px] uppercase tracking-widest font-bold mb-12 inline-block w-max" style={{ color: "var(--color-text-primary)" }}>
          ← Katalog
        </Link>
        
        <div className="flex flex-col gap-6">
          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--color-text-muted)" }}>
            {produk.kategori?.nama_kategori || "Koleksi Umum"}
          </p>
          
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 4vw, 4rem)", lineHeight: 1.1, textTransform: "uppercase" }}>
            {produk.nama_produk}
          </h1>
          
          <p className="text-xl md:text-2xl mt-4" style={{ fontFamily: "var(--font-mono)" }}>
            {formatRupiah(produk.harga)}
          </p>

          <div className="w-full h-px my-6" style={{ background: "var(--color-border-subtle)" }}></div>

          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            {produk.deskripsi}
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <p className="text-[9px] font-bold uppercase tracking-widest">
              Status: <span style={{ color: produk.stok > 0 ? "var(--color-text-primary)" : "#ef4444" }}>{produk.stok > 0 ? `${produk.stok} Unit Tersedia` : "Habis"}</span>
            </p>

            {/* Kontrol Belanja */}
            {produk.stok > 0 && (!user || user.role === "Pelanggan") ? (
              <div className="mt-6 flex flex-col xl:flex-row gap-4">
                <div className="flex items-center justify-between border" style={{ borderColor: "var(--color-border-subtle)", minWidth: "140px" }}>
                  <button 
                    onClick={() => handleKuantitasChange(-1)} 
                    disabled={kuantitas <= 1}
                    className="p-4 text-lg transition-colors hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                  >−</button>
                  <span className="text-sm font-bold" style={{ fontFamily: "var(--font-mono)" }}>{kuantitas}</span>
                  <button 
                    onClick={() => handleKuantitasChange(1)} 
                    disabled={kuantitas >= produk.stok}
                    className="p-4 text-lg transition-colors hover:bg-black/5 disabled:opacity-30 cursor-pointer"
                  >+</button>
                </div>

                <button 
                  onClick={handleTambahKeranjang} 
                  className="flex-1 py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer"
                  style={{
                    background: "var(--color-text-primary)",
                    color: "var(--color-text-inverted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--color-text-primary)";
                    e.currentTarget.style.boxShadow = "inset 0 0 0 1px var(--color-text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--color-text-primary)";
                    e.currentTarget.style.color = "var(--color-text-inverted)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Tambah ke Keranjang
                </button>
              </div>
            ) : user && user.role === "Admin" ? (
              <div className="mt-6 p-6 border" style={{ borderColor: "var(--color-text-primary)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4">Akses Admin</p>
                <Link to="/admin/produk" className="text-[9px] font-bold uppercase tracking-widest border-b" style={{ borderColor: "var(--color-text-primary)" }}>Kelola Produk →</Link>
              </div>
            ) : produk.stok === 0 ? (
              <div className="mt-6 p-4 border" style={{ borderColor: "var(--color-border-subtle)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-center" style={{ color: "var(--color-text-muted)" }}>Produk Tidak Tersedia</p>
              </div>
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailProduk;
