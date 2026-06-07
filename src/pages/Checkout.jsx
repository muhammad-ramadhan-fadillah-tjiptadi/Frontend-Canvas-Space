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

  useEffect(() => {
    if (user) {
      setAddress(user.alamat || "");
    }
  }, [user]);

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

      await api.post("/checkout", payload);
      
      clearCartAfterCheckout();
      
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
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center" style={{ background: "var(--color-bg-base)", color: "var(--color-text-primary)" }}>
        <h2 className="text-3xl mb-4" style={{ fontFamily: "var(--font-serif)", textTransform: "uppercase" }}>Keranjang Kosong</h2>
        <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--color-text-muted)" }}>Tambahkan beberapa karya seni sebelum melanjutkan ke pembayaran.</p>
        <Link to="/" className="mt-8 text-[10px] font-bold uppercase tracking-widest border-b" style={{ borderColor: "var(--color-text-primary)" }}>
          ← Kembali Berbelanja
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 lg:px-24" style={{ background: "var(--color-bg-base)", color: "var(--color-text-primary)" }}>
      <div className="max-w-6xl mx-auto">
        <Link to="/cart" className="text-[9px] uppercase tracking-widest font-bold mb-12 inline-block" style={{ color: "var(--color-text-primary)" }}>
          ← Kembali ke Keranjang
        </Link>
        
        <h1 className="mb-12" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 4vw, 4rem)", lineHeight: 1.1, textTransform: "uppercase" }}>
          Penyelesaian<br/>Pesanan.
        </h1>

        {errors.general && (
          <div className="mb-8 px-6 py-4 flex items-center gap-4" style={{ border: "1px solid #ef4444", boxShadow: "4px 4px 0 #ef4444" }}>
            <span style={{ color: "#ef4444", fontSize: "12px" }}>■</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">
              {errors.general[0]}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">
          
          {/* Form Pengiriman */}
          <div className="w-full lg:w-7/12 flex flex-col gap-12">
            
            {/* Section: Alamat */}
            <div className="flex flex-col gap-6">
              <div className="flex items-end gap-4 border-b pb-4" style={{ borderColor: "var(--color-border-subtle)" }}>
                <span className="text-2xl font-light" style={{ fontFamily: "var(--font-serif)" }}>01</span>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Informasi Pengiriman</h3>
              </div>
              
              <div className="flex flex-col gap-3">
                <label htmlFor="address" className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>Alamat Lengkap Tujuan</label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Masukkan alamat pengiriman secara detail..."
                  rows="4"
                  className="w-full bg-transparent outline-none p-4 resize-none transition-all"
                  style={{ border: "1px solid var(--color-border-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                  onFocus={(e) => e.target.style.border = "1px solid var(--color-text-primary)"}
                  onBlur={(e) => e.target.style.border = "1px solid var(--color-border-subtle)"}
                  required
                />
                {errors.alamat_pengiriman && <span className="text-[9px] text-red-500 uppercase tracking-widest mt-1">{errors.alamat_pengiriman[0]}</span>}
              </div>
            </div>

            {/* Section: Pembayaran */}
            <div className="flex flex-col gap-6">
              <div className="flex items-end gap-4 border-b pb-4" style={{ borderColor: "var(--color-border-subtle)" }}>
                <span className="text-2xl font-light" style={{ fontFamily: "var(--font-serif)" }}>02</span>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Metode Pembayaran</h3>
              </div>
              
              <div className="flex flex-col gap-3">
                <label htmlFor="payment" className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>Pilih Metode</label>
                <div className="relative">
                  <select
                    id="payment"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-transparent outline-none p-4 appearance-none rounded-none cursor-pointer"
                    style={{ border: "1px solid var(--color-border-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                  >
                    <option value="Transfer Bank Manual">Transfer Bank Manual (BCA/Mandiri)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[10px]">▼</div>
                </div>
              </div>

              {/* Bank Info Brutalist Box */}
              <div className="mt-4 p-6 border" style={{ borderColor: "var(--color-text-primary)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4">Instruksi Transfer</p>
                <div className="flex flex-col gap-2 mb-6" style={{ fontFamily: "var(--font-mono)", fontSize: "14px" }}>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--color-text-muted)" }}>BANK:</span>
                    <span>BCA</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--color-text-muted)" }}>NO. REK:</span>
                    <span className="font-bold">1234 5678 90</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "var(--color-text-muted)" }}>A.N:</span>
                    <span>CANVAS SPACE</span>
                  </div>
                </div>
                <p className="text-[9px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)", borderTop: "1px dashed var(--color-border-subtle)", paddingTop: "1rem" }}>
                  * Harap transfer tepat sesuai nominal Total Tagihan di samping untuk memudahkan verifikasi otomatis oleh sistem.
                </p>
              </div>
            </div>

          </div>

          {/* Rincian Tagihan (Invoice) */}
          <div className="w-full lg:w-5/12 sticky top-24">
            <div className="border p-8 md:p-12" style={{ borderColor: "var(--color-text-primary)", background: "#fff", boxShadow: "8px 8px 0 var(--color-text-primary)" }}>
              <div className="flex justify-between items-end mb-8 border-b pb-6" style={{ borderColor: "var(--color-text-primary)" }}>
                <h3 className="text-xl" style={{ fontFamily: "var(--font-serif)" }}>FAKTUR / INVOICE</h3>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold">Ringkasan</span>
              </div>
              
              <div className="flex flex-col gap-4 mb-8">
                {cart.map((item) => (
                  <div key={item.produk_id} className="flex justify-between items-start text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                    <div className="flex flex-col pr-4">
                      <span className="font-bold uppercase">{item.nama_produk}</span>
                      <span className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>Kuantitas: {item.kuantitas}</span>
                    </div>
                    <span className="whitespace-nowrap">{formatRupiah(item.harga * item.kuantitas)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6 mb-8" style={{ borderColor: "var(--color-text-primary)", borderTopStyle: "dashed" }}>
                <div className="flex justify-between items-center text-lg md:text-xl font-bold" style={{ fontFamily: "var(--font-mono)" }}>
                  <span className="uppercase text-[12px] tracking-widest" style={{ fontFamily: "var(--font-sans)" }}>Total Bayar</span>
                  <span>{formatRupiah(totalBelanja)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer"
                style={{
                  background: submitting ? "var(--color-border-subtle)" : "var(--color-text-primary)",
                  color: submitting ? "var(--color-text-muted)" : "var(--color-text-inverted)",
                  border: submitting ? "none" : "1px solid var(--color-text-primary)",
                }}
                onMouseEnter={(e) => {
                  if(!submitting){
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--color-text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if(!submitting){
                    e.currentTarget.style.background = "var(--color-text-primary)";
                    e.currentTarget.style.color = "var(--color-text-inverted)";
                  }
                }}
              >
                {submitting ? "Memproses..." : "Konfirmasi & Buat Pesanan"}
              </button>
            </div>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Checkout;
