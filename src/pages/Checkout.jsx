import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";
import api from "../api/axios";

const Checkout = () => {
  const { user } = useAuth();
  const { cart, clearCartAfterCheckout } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank Manual");
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Set default alamat dari user profile
  useEffect(() => {
    if (user) {
      setAddress(user.alamat || "");
    }
  }, [user]);

  // Hitung total harga
  const totalBelanja = cart.reduce((acc, item) => acc + item.harga * item.kuantitas, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    if (cart.length === 0) {
      setErrors({ general: ["Keranjang belanja Anda kosong!"] });
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        item_belanja: cart.map((item) => ({
          produk_id: item.produk_id,
          jumlah: item.kuantitas,
        })),
        metode_bayar: paymentMethod,
        alamat_pengiriman: address,
      };

      const response = await api.post("/checkout", payload);
      
      // Kosongkan keranjang belanja lokal
      clearCartAfterCheckout();
      
      // Arahkan ke halaman riwayat pesanan
      navigate("/riwayat", {
        state: { successMsg: "Checkout berhasil! Silakan unggah bukti transfer untuk pesanan Anda di bawah ini." }
      });
    } catch (error) {
      setErrors(error.response?.data?.errors || { general: [error.response?.data?.message || "Gagal melakukan checkout."] });
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page empty-checkout-page">
        <div className="empty-cart-container">
          <h2>Checkout Tidak Tersedia</h2>
          <p>Keranjang Anda kosong. Silakan tambahkan barang terlebih dahulu.</p>
          <Link to="/" className="continue-shopping-btn">Kembali Berbelanja</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h2>Penyelesaian Pesanan (Checkout)</h2>

        {errors.general && <div className="alert alert-danger">{errors.general[0]}</div>}

        <form onSubmit={handleSubmit} className="checkout-form-layout">
          {/* Form Pengiriman */}
          <div className="checkout-details-section">
            <h3>Informasi Pengiriman & Pembayaran</h3>

            <div className="form-group">
              <label htmlFor="address">Alamat Lengkap Pengiriman</label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Masukkan alamat pengiriman lengkap..."
                rows="4"
                required
              />
              {errors.alamat_pengiriman && <span className="input-error">{errors.alamat_pengiriman[0]}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="payment">Metode Pembayaran</label>
              <select
                id="payment"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Transfer Bank Manual">Transfer Bank Manual (BCA/Mandiri)</option>
              </select>
            </div>

            <div className="bank-info-box">
              <h4>🏦 Informasi Rekening Transfer:</h4>
              <p>Bank BCA: <strong>1234567890</strong> a.n. <strong>Canvas Space</strong></p>
              <p className="bank-info-note">*Harap transfer tepat sesuai nominal total tagihan Anda.</p>
            </div>
          </div>

          {/* Rincian Tagihan */}
          <div className="checkout-summary-section">
            <h3>Rincian Tagihan</h3>
            
            <div className="checkout-items-summary">
              {cart.map((item) => (
                <div key={item.produk_id} className="checkout-item-line">
                  <span>{item.nama_produk} (x{item.kuantitas})</span>
                  <span>{formatRupiah(item.harga * item.kuantitas)}</span>
                </div>
              ))}
            </div>

            <div className="divider"></div>

            <div className="summary-row total-row">
              <span>Total Bayar</span>
              <span>{formatRupiah(totalBelanja)}</span>
            </div>

            <button type="submit" className="place-order-btn" disabled={submitting}>
              {submitting ? "Memproses Pesanan..." : "Konfirmasi & Buat Pesanan"}
            </button>

            <Link to="/cart" className="back-to-cart-link">
              ← Kembali ke Keranjang
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
