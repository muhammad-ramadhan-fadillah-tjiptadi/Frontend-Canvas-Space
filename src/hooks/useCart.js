import { useState } from "react";

export const useCart = () => {
  // State lokal mengambil data awal dari LocalStorage jika ada
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("canva_space_cart")) || [];
  });

  // 1. Fungsi menambah item ke keranjang
  const addToCart = (produk, kuantitas) => {
    let currentCart = [...cart];
    const existingItem = currentCart.find(
      (item) => item.produk_id === produk.id,
    );

    if (existingItem) {
      existingItem.kuantitas += kuantitas;
    } else {
      currentCart.push({
        produk_id: produk.id,
        nama_produk: produk.nama_produk,
        harga: produk.harga,
        kuantitas: kuantitas,
      });
    }

    setCart(currentCart);
    localStorage.setItem("canva_space_cart", JSON.stringify(currentCart));
  };

  // 2. Fungsi mengosongkan isi keranjang otomatis setelah checkout sukses (FR-03)
  const clearCartAfterCheckout = () => {
    setCart([]);
    localStorage.removeItem("canva_space_cart");
  };

  // 3. Fungsi menghapus item dari keranjang
  const removeFromCart = (produkId) => {
    const updatedCart = cart.filter((item) => item.produk_id !== produkId);
    setCart(updatedCart);
    localStorage.setItem("canva_space_cart", JSON.stringify(updatedCart));
  };

  // 4. Fungsi mengubah kuantitas item di keranjang secara langsung
  const updateKuantitas = (produkId, newKuantitas) => {
    if (newKuantitas < 1) return;
    const updatedCart = cart.map((item) => {
      if (item.produk_id === produkId) {
        return { ...item, kuantitas: newKuantitas };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("canva_space_cart", JSON.stringify(updatedCart));
  };

  return { cart, addToCart, clearCartAfterCheckout, removeFromCart, updateKuantitas };
};
