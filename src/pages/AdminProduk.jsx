import { useState, useEffect } from "react";
import api from "../api/axios";

const AdminProduk = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState({});

  // Form State
  const [formMode, setFormMode] = useState("closed"); // 'closed', 'add', 'edit'
  const [editId, setEditId] = useState(null);
  
  const [namaProduk, setNamaProduk] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [gambarFile, setGambarFile] = useState(null);

  const fetchData = async () => {
    try {
      const [prodResponse, catResponse] = await Promise.all([
        api.get("/produk"),
        api.get("/kategori"),
      ]);
      const prodData = prodResponse.data.data.data || prodResponse.data.data || [];
      setProducts(prodData);
      setCategories(catResponse.data.data || []);
    } catch (error) {
      console.error("Gagal memuat data produk:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setNamaProduk("");
    setHarga("");
    setStok("");
    setDeskripsi("");
    setKategoriId("");
    setGambarFile(null);
    setErrors({});
    setFormMode("closed");
    setEditId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setFormMode("add");
    if (categories.length > 0) {
      setKategoriId(categories[0].id.toString());
    }
  };

  const handleOpenEdit = (produk) => {
    setErrors({});
    setEditId(produk.id);
    setNamaProduk(produk.nama_produk);
    setHarga(produk.harga);
    setStok(produk.stok);
    setDeskripsi(produk.deskripsi || "");
    setKategoriId(produk.kategori_id.toString());
    setGambarFile(null); // Kosongkan file uploader (hanya ganti jika dipilih baru)
    setFormMode("edit");
  };

  const handleFileChange = (e) => {
    setGambarFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");
    setSubmitting(true);

    const formData = new FormData();
    formData.append("nama_produk", namaProduk);
    formData.append("harga", harga);
    formData.append("stok", stok);
    formData.append("deskripsi", deskripsi);
    formData.append("kategori_id", kategoriId);

    if (gambarFile) {
      formData.append("gambar", gambarFile);
    }

    try {
      if (formMode === "add") {
        const response = await api.post("/produk", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setSuccessMsg("Produk baru berhasil ditambahkan!");
      } else if (formMode === "edit") {
        // Menggunakan POST ke URL update karena Laravel match(['put','patch','post'], ...)
        // POST dengan Form-Data lebih aman untuk upload file dibanding PUT di Laravel
        const response = await api.post(`/produk/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setSuccessMsg("Produk berhasil diperbarui!");
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      setErrors(error.response?.data?.errors || { general: [error.response?.data?.message || "Gagal menyimpan produk."] });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus produk '${name}'?`)) {
      return;
    }

    setSuccessMsg("");
    try {
      await api.delete(`/produk/${id}`);
      setSuccessMsg(`Produk '${name}' berhasil dihapus (Soft Deleted)!`);
      fetchData();
    } catch (error) {
      console.error("Gagal menghapus produk:", error);
      alert(error.response?.data?.message || "Gagal menghapus produk.");
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header-row">
          <div>
            <h2>Dashboard Admin: Manajemen Produk</h2>
            <p className="admin-subtitle">Tambah, ubah, atau hapus katalog furniture produk</p>
          </div>
          {formMode === "closed" && (
            <button onClick={handleOpenAdd} className="add-new-btn">
              ➕ Tambah Produk Baru
            </button>
          )}
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {errors.general && <div className="alert alert-danger">{errors.general[0]}</div>}

        {/* Layout Utama */}
        {formMode !== "closed" && (
          <div className="admin-form-container">
            <h3>{formMode === "add" ? "Tambah Produk Baru" : "Edit Produk"}</h3>
            <form onSubmit={handleSubmit} className="admin-crud-form">
              <div className="form-row-grid">
                <div className="form-group">
                  <label htmlFor="pname">Nama Produk</label>
                  <input
                    type="text"
                    id="pname"
                    value={namaProduk}
                    onChange={(e) => setNamaProduk(e.target.value)}
                    required
                  />
                  {errors.nama_produk && <span className="input-error">{errors.nama_produk[0]}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="pcat">Kategori</label>
                  <select
                    id="pcat"
                    value={kategoriId}
                    onChange={(e) => setKategoriId(e.target.value)}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nama_kategori}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label htmlFor="pprice">Harga (Rupiah)</label>
                  <input
                    type="number"
                    id="pprice"
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    required
                  />
                  {errors.harga && <span className="input-error">{errors.harga[0]}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="pstock">Stok Awal</label>
                  <input
                    type="number"
                    id="pstock"
                    value={stok}
                    onChange={(e) => setStok(e.target.value)}
                    required
                  />
                  {errors.stok && <span className="input-error">{errors.stok[0]}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pdesc">Deskripsi Lengkap</label>
                <textarea
                  id="pdesc"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows="4"
                  required
                />
                {errors.deskripsi && <span className="input-error">{errors.deskripsi[0]}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="pimg">Gambar Produk {formMode === "edit" && "(Pilih baru jika ingin mengganti)"}</label>
                <input
                  type="file"
                  id="pimg"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={formMode === "add"}
                />
                {errors.gambar && <span className="input-error">{errors.gambar[0]}</span>}
              </div>

              <div className="form-actions-row">
                <button type="submit" className="save-btn" disabled={submitting}>
                  {submitting ? "Menyimpan..." : "Simpan Produk"}
                </button>
                <button type="button" onClick={resetForm} className="cancel-btn">
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabel Daftar Produk */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Memuat produk...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Gambar</th>
                  <th>Nama Produk</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const imageSrc = p.gambar
                    ? p.gambar.startsWith("http")
                      ? p.gambar
                      : `http://localhost:8000${p.gambar}`
                    : "https://via.placeholder.com/100x70?text=No+Image";

                  return (
                    <tr key={p.id}>
                      <td>
                        <img src={imageSrc} alt={p.nama_produk} className="table-thumbnail" />
                      </td>
                      <td>
                        <strong>{p.nama_produk}</strong>
                      </td>
                      <td>{p.kategori?.nama_kategori || "Umum"}</td>
                      <td className="table-price">{formatRupiah(p.harga)}</td>
                      <td>{p.stok} unit</td>
                      <td>
                        <div className="crud-action-buttons">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="edit-btn"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.nama_produk)}
                            className="delete-btn"
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>Belum ada produk furniture di database Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProduk;
