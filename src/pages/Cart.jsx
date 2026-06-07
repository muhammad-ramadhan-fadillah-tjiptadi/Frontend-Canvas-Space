import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const Cart = () => {
  const { cart, removeFromCart, updateKuantitas } = useCart();

  // Hitung total belanjaan
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
      <div className="cart-page empty-cart-page">
        <div className="empty-cart-container">
          <h2>Keranjang Belanja Kosong</h2>
          <p>Anda belum menambahkan furniture apa pun ke dalam keranjang belanja.</p>
          <Link to="/" className="continue-shopping-btn">
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2>Keranjang Belanja</h2>

        <div className="cart-content">
          {/* Daftar Item */}
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.produk_id} className="cart-item-row">
                <div className="cart-item-info">
                  <h4>{item.nama_produk}</h4>
                  <p className="cart-item-price">{formatRupiah(item.harga)}</p>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-selector-sm">
                    <button
                      onClick={() => updateKuantitas(item.produk_id, item.kuantitas - 1)}
                      disabled={item.kuantitas <= 1}
                    >
                      -
                    </button>
                    <span>{item.kuantitas}</span>
                    <button
                      onClick={() => updateKuantitas(item.produk_id, item.kuantitas + 1)}
                    >
                      +
                    </button>
                  </div>

                  <p className="cart-item-subtotal">
                    {formatRupiah(item.harga * item.kuantitas)}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.produk_id)}
                    className="remove-item-btn"
                    title="Hapus barang"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Ringkasan Belanja */}
          <div className="cart-summary-card">
            <h3>Ringkasan Belanja</h3>
            <div className="summary-row">
              <span>Total Item</span>
              <span>{cart.reduce((acc, item) => acc + item.kuantitas, 0)} unit</span>
            </div>
            <div className="summary-row total-row">
              <span>Total Harga</span>
              <span>{formatRupiah(totalBelanja)}</span>
            </div>
            <div className="divider"></div>
            <Link to="/checkout" className="checkout-btn">
              Lanjutkan ke Checkout
            </Link>
            <Link to="/" className="back-to-shop-link">
              ← Tambah barang lagi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
