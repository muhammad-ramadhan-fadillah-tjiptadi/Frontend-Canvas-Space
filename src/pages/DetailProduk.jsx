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
      return;
    }

    addToCart(produk, kuantitas);
    setSuccessMsg(`Berhasil menambahkan ${kuantitas} item ke keranjang belanja Anda!`);
    
    // Hilangkan notifikasi sukses setelah 4 detik
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
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Memuat detail produk...</p>
      </div>
    );
  }

  if (errorMsg && !produk) {
    return (
      <div className="empty-state">
        <p className="error-text">{errorMsg}</p>
        <Link to="/" className="back-link">Kembali ke Beranda</Link>
      </div>
    );
  }

  const imageSrc = produk.gambar
    ? produk.gambar.startsWith("http")
      ? produk.gambar
      : `http://localhost:8000${produk.gambar}`
    : "https://via.placeholder.com/600x400?text=No+Image";

  return (
    <div className="product-detail-page">
      <div className="detail-container">
        <div className="detail-image-sec">
          <img src={imageSrc} alt={produk.nama_produk} />
        </div>

        <div className="detail-info-sec">
          <Link to="/" className="back-to-catalog">← Kembali ke Katalog</Link>
          
          <h1 className="product-title">{produk.nama_produk}</h1>
          <p className="product-category">Kategori: {produk.kategori?.nama_kategori || "Umum"}</p>
          <div className="divider"></div>
          
          <p className="detail-price">{formatRupiah(produk.harga)}</p>
          <p className="detail-stock">
            Status Stok: {produk.stok > 0 ? (
              <span className="stock-in">Tersedia ({produk.stok} unit)</span>
            ) : (
              <span className="stock-out">Habis</span>
            )}
          </p>

          <p className="detail-description">{produk.deskripsi}</p>
          <div className="divider"></div>

          {/* Alert Success */}
          {successMsg && (
            <div className="alert alert-success">
              {successMsg}{" "}
              <Link to="/cart" className="alert-link">Buka Keranjang →</Link>
            </div>
          )}

          {/* Kontrol Belanja */}
          {produk.stok > 0 && (!user || user.role === "Pelanggan") ? (
            <div className="cart-controls">
              <div className="quantity-selector">
                <button onClick={() => handleKuantitasChange(-1)} disabled={kuantitas <= 1}>
                  -
                </button>
                <span>{kuantitas}</span>
                <button onClick={() => handleKuantitasChange(1)} disabled={kuantitas >= produk.stok}>
                  +
                </button>
              </div>

              <button onClick={handleTambahKeranjang} className="add-to-cart-btn">
                🛒 Tambahkan ke Keranjang
              </button>
            </div>
          ) : user && user.role === "Admin" ? (
            <div className="admin-notice">
              <p>Anda login sebagai **Admin**. Silakan kelola produk di panel admin.</p>
              <Link to="/admin/produk" className="admin-manage-btn">Kelola Produk</Link>
            </div>
          ) : produk.stok === 0 ? (
            <div className="sold-out-container">
              <p className="sold-out-text">Produk ini saat ini sedang tidak tersedia.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DetailProduk;
