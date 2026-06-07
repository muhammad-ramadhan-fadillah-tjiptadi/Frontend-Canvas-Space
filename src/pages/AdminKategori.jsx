import { useState, useEffect } from "react";
import api from "../api/axios";

const AdminKategori = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState({});

  // Form State
  const [formMode, setFormMode] = useState("closed"); // 'closed', 'add', 'edit'
  const [editId, setEditId] = useState(null);
  const [namaKategori, setNamaKategori] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await api.get("/kategori");
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setNamaKategori("");
    setErrors({});
    setFormMode("closed");
    setEditId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setFormMode("add");
  };

  const handleOpenEdit = (cat) => {
    setErrors({});
    setEditId(cat.id);
    setNamaKategori(cat.nama_kategori);
    setFormMode("edit");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");
    setSubmitting(true);

    try {
      if (formMode === "add") {
        await api.post("/kategori", { nama_kategori: namaKategori });
        setSuccessMsg("Kategori baru berhasil ditambahkan!");
      } else if (formMode === "edit") {
        await api.put(`/kategori/${editId}`, { nama_kategori: namaKategori });
        setSuccessMsg("Kategori berhasil diperbarui!");
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      console.error("Gagal menyimpan kategori:", error);
      setErrors(error.response?.data?.errors || { general: [error.response?.data?.message || "Gagal menyimpan kategori."] });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kategori '${name}'? Ini akan berpotensi merusak produk di bawah kategori ini.`)) {
      return;
    }

    setSuccessMsg("");
    try {
      await api.delete(`/kategori/${id}`);
      setSuccessMsg(`Kategori '${name}' berhasil dihapus!`);
      fetchCategories();
    } catch (error) {
      console.error("Gagal menghapus kategori:", error);
      alert(error.response?.data?.message || "Gagal menghapus kategori.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header-row">
          <div>
            <h2>Dashboard Admin: Kategori Produk</h2>
            <p className="admin-subtitle">Kelola klasifikasi kategori furniture di toko online Anda</p>
          </div>
          {formMode === "closed" && (
            <button onClick={handleOpenAdd} className="add-new-btn">
              ➕ Tambah Kategori Baru
            </button>
          )}
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {errors.general && <div className="alert alert-danger">{errors.general[0]}</div>}

        {/* Form CRUD Kategori */}
        {formMode !== "closed" && (
          <div className="admin-form-container">
            <h3>{formMode === "add" ? "Tambah Kategori Baru" : "Edit Kategori"}</h3>
            <form onSubmit={handleSubmit} className="admin-crud-form">
              <div className="form-group">
                <label htmlFor="catname">Nama Kategori</label>
                <input
                  type="text"
                  id="catname"
                  value={namaKategori}
                  onChange={(e) => setNamaKategori(e.target.value)}
                  placeholder="Misal: Kursi, Meja, Tempat Tidur..."
                  required
                />
                {errors.nama_kategori && <span className="input-error">{errors.nama_kategori[0]}</span>}
              </div>

              <div className="form-actions-row">
                <button type="submit" className="save-btn" disabled={submitting}>
                  {submitting ? "Menyimpan..." : "Simpan Kategori"}
                </button>
                <button type="button" onClick={resetForm} className="cancel-btn">
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabel Kategori */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Memuat kategori...</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="admin-table-wrapper select-kategori-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID Kategori</th>
                  <th>Nama Kategori</th>
                  <th>Tanggal Dibuat</th>
                  <th>Aksi Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>#{cat.id}</td>
                    <td>
                      <strong>{cat.nama_kategori}</strong>
                    </td>
                    <td>
                      {new Date(cat.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </td>
                    <td>
                      <div className="crud-action-buttons">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="edit-btn"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.nama_kategori)}
                          className="delete-btn"
                        >
                          🗑️ Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>Belum ada kategori furniture yang dibuat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminKategori;
