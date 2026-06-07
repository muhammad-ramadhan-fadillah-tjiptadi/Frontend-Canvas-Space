import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const Cart = () => {
  const { cart, removeFromCart, updateKuantitas } = useCart();

  const totalBelanja = cart.reduce((acc, item) => acc + item.harga * item.kuantitas, 0);

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
        <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--color-text-muted)" }}>Anda belum memasukkan karya seni apa pun.</p>
        <Link to="/" className="mt-8 text-[10px] font-bold uppercase tracking-widest border-b" style={{ borderColor: "var(--color-text-primary)" }}>
          ← Mulai Eksplorasi
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 lg:px-24" style={{ background: "var(--color-bg-base)", color: "var(--color-text-primary)" }}>
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-[9px] uppercase tracking-widest font-bold mb-12 inline-block" style={{ color: "var(--color-text-primary)" }}>
          ← Lanjut Eksplorasi
        </Link>
        
        <h1 className="mb-12" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 4vw, 4rem)", lineHeight: 1.1, textTransform: "uppercase" }}>
          Keranjang.
        </h1>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">
          
          {/* Daftar Item */}
          <div className="w-full lg:w-7/12 flex flex-col gap-12">
            <div className="flex items-end gap-4 border-b pb-4" style={{ borderColor: "var(--color-border-subtle)" }}>
              <span className="text-2xl font-light" style={{ fontFamily: "var(--font-serif)" }}>{cart.length.toString().padStart(2, '0')}</span>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Item Terpilih</h3>
            </div>

            <div className="flex flex-col gap-8">
              {cart.map((item) => (
                <div key={item.produk_id} className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b" style={{ borderColor: "var(--color-border-subtle)" }}>
                  
                  {/* Info */}
                  <div className="flex flex-col gap-2 mb-6 md:mb-0">
                    <h4 className="text-xl md:text-2xl font-bold uppercase" style={{ fontFamily: "var(--font-serif)" }}>{item.nama_produk}</h4>
                    <p className="text-sm font-bold" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-secondary)" }}>{formatRupiah(item.harga)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex items-center border" style={{ borderColor: "var(--color-border-subtle)", minWidth: "120px" }}>
                      <button 
                        onClick={() => updateKuantitas(item.produk_id, item.kuantitas - 1)}
                        disabled={item.kuantitas <= 1}
                        className="p-3 text-lg transition-colors hover:bg-black/5 disabled:opacity-30 cursor-pointer w-1/3 text-center"
                      >−</button>
                      <span className="text-sm font-bold w-1/3 text-center" style={{ fontFamily: "var(--font-mono)" }}>{item.kuantitas}</span>
                      <button 
                        onClick={() => updateKuantitas(item.produk_id, item.kuantitas + 1)}
                        className="p-3 text-lg transition-colors hover:bg-black/5 cursor-pointer w-1/3 text-center"
                      >+</button>
                    </div>

                    <p className="text-lg font-bold w-32 text-right" style={{ fontFamily: "var(--font-mono)" }}>
                      {formatRupiah(item.harga * item.kuantitas)}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.produk_id)}
                      className="text-2xl hover:text-red-500 transition-colors cursor-pointer p-2"
                      title="Hapus"
                    >
                      ×
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Ringkasan Belanja */}
          <div className="w-full lg:w-5/12 sticky top-24">
            <div className="border p-8 md:p-12" style={{ borderColor: "var(--color-text-primary)", background: "#fff", boxShadow: "8px 8px 0 var(--color-text-primary)" }}>
              <div className="flex justify-between items-end mb-8 border-b pb-6" style={{ borderColor: "var(--color-text-primary)" }}>
                <h3 className="text-xl" style={{ fontFamily: "var(--font-serif)" }}>RINGKASAN</h3>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold">Pesanan</span>
              </div>
              
              <div className="flex justify-between items-center mb-6 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="font-bold uppercase">Total Item</span>
                <span>{cart.reduce((acc, item) => acc + item.kuantitas, 0)} Unit</span>
              </div>

              <div className="border-t pt-6 mb-8" style={{ borderColor: "var(--color-text-primary)", borderTopStyle: "dashed" }}>
                <div className="flex justify-between items-center text-lg md:text-xl font-bold" style={{ fontFamily: "var(--font-mono)" }}>
                  <span className="uppercase text-[12px] tracking-widest" style={{ fontFamily: "var(--font-sans)" }}>Total Harga</span>
                  <span>{formatRupiah(totalBelanja)}</span>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="block text-center w-full py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer"
                style={{
                  background: "var(--color-text-primary)",
                  color: "var(--color-text-inverted)",
                  border: "1px solid var(--color-text-primary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--color-text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--color-text-primary)";
                  e.currentTarget.style.color = "var(--color-text-inverted)";
                }}
              >
                Lanjutkan ke Checkout →
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Cart;
