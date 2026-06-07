import { useState, useEffect } from "react";
import api from "../api/axios";

const AdminProduk = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState({});

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
    setGambarFile(null);
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
        await api.post("/produk", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setSuccessMsg("Produk baru berhasil ditambahkan.");
      } else if (formMode === "edit") {
        await api.post(`/produk/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setSuccessMsg("Produk berhasil diperbarui.");
      }
      
      resetForm();
      fetchData();
    } catch (error) {
      setErrors(error.response?.data?.errors || { general: [error.response?.data?.message || "Gagal menyimpan produk."] });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus produk '${name}'?`)) return;
    setSuccessMsg("");
    try {
      await api.delete(`/produk/${id}`);
      setSuccessMsg(`Produk '${name}' berhasil dihapus.`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus produk.");
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="min-h-screen p-8 md:p-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 4vw, 4rem)", lineHeight: 1.1, textTransform: "uppercase", color: "var(--color-text-primary)" }}>
            Manajemen<br/>Produk.
          </h2>
          <p className="mt-4 text-[11px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            Tambah, ubah, atau hapus katalog produk
          </p>
        </div>
        
        {formMode === "closed" && (
          <button 
            onClick={handleOpenAdd} 
            className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all"
            style={{ border: "1px solid var(--color-text-primary)", background: "var(--color-text-primary)", color: "var(--color-text-inverted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-primary)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--color-text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-text-primary)"; e.currentTarget.style.color = "var(--color-text-inverted)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            + Tambah Produk
          </button>
        )}
      </div>

      {successMsg && (
        <div className="mb-8 px-6 py-4 flex items-center gap-4 bg-white" style={{ border: "1px solid #10b981", boxShadow: "4px 4px 0 #10b981" }}>
          <span style={{ color: "#10b981", fontSize: "12px" }}>■</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{successMsg}</span>
        </div>
      )}
      {errors.general && (
        <div className="mb-8 px-6 py-4 flex items-center gap-4 bg-white" style={{ border: "1px solid #ef4444", boxShadow: "4px 4px 0 #ef4444" }}>
          <span style={{ color: "#ef4444", fontSize: "12px" }}>■</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">{errors.general[0]}</span>
        </div>
      )}

      {formMode !== "closed" && (
        <div className="mb-16 p-8 bg-white" style={{ border: "1px solid var(--color-text-primary)", boxShadow: "8px 8px 0 var(--color-text-primary)" }}>
          <div className="flex items-center justify-between mb-8 border-b pb-4" style={{ borderColor: "var(--color-border-subtle)" }}>
            <h3 className="text-[14px] font-bold uppercase tracking-[0.2em]">{formMode === "add" ? "Tambah Produk Baru" : "Edit Produk"}</h3>
            <button onClick={resetForm} className="text-xl hover:scale-110 transition-transform">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label htmlFor="pname" className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Nama Produk</label>
                <input
                  type="text" id="pname" value={namaProduk} onChange={(e) => setNamaProduk(e.target.value)} required
                  className="w-full bg-transparent outline-none p-4 transition-all"
                  style={{ border: "1px solid var(--color-border-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                  onFocus={(e) => e.target.style.border = "1px solid var(--color-text-primary)"}
                  onBlur={(e) => e.target.style.border = "1px solid var(--color-border-subtle)"}
                />
                {errors.nama_produk && <span className="text-[9px] text-red-500 uppercase tracking-widest mt-1">{errors.nama_produk[0]}</span>}
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="pcat" className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Kategori</label>
                <select
                  id="pcat" value={kategoriId} onChange={(e) => setKategoriId(e.target.value)} required
                  className="w-full bg-transparent outline-none p-4 transition-all appearance-none rounded-none"
                  style={{ border: "1px solid var(--color-border-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                  onFocus={(e) => e.target.style.border = "1px solid var(--color-text-primary)"}
                  onBlur={(e) => e.target.style.border = "1px solid var(--color-border-subtle)"}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nama_kategori}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label htmlFor="pprice" className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Harga (Rupiah)</label>
                <input
                  type="number" id="pprice" value={harga} onChange={(e) => setHarga(e.target.value)} required
                  className="w-full bg-transparent outline-none p-4 transition-all"
                  style={{ border: "1px solid var(--color-border-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                  onFocus={(e) => e.target.style.border = "1px solid var(--color-text-primary)"}
                  onBlur={(e) => e.target.style.border = "1px solid var(--color-border-subtle)"}
                />
                {errors.harga && <span className="text-[9px] text-red-500 uppercase tracking-widest mt-1">{errors.harga[0]}</span>}
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="pstock" className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Stok Awal</label>
                <input
                  type="number" id="pstock" value={stok} onChange={(e) => setStok(e.target.value)} required
                  className="w-full bg-transparent outline-none p-4 transition-all"
                  style={{ border: "1px solid var(--color-border-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                  onFocus={(e) => e.target.style.border = "1px solid var(--color-text-primary)"}
                  onBlur={(e) => e.target.style.border = "1px solid var(--color-border-subtle)"}
                />
                {errors.stok && <span className="text-[9px] text-red-500 uppercase tracking-widest mt-1">{errors.stok[0]}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="pdesc" className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Deskripsi Lengkap</label>
              <textarea
                id="pdesc" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} rows="4" required
                className="w-full bg-transparent outline-none p-4 resize-none transition-all"
                style={{ border: "1px solid var(--color-border-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                onFocus={(e) => e.target.style.border = "1px solid var(--color-text-primary)"}
                onBlur={(e) => e.target.style.border = "1px solid var(--color-border-subtle)"}
              />
              {errors.deskripsi && <span className="text-[9px] text-red-500 uppercase tracking-widest mt-1">{errors.deskripsi[0]}</span>}
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="pimg" className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                Gambar Produk {formMode === "edit" && <span className="lowercase normal-case font-normal">(opsional: pilih baru jika ingin mengganti)</span>}
              </label>
              <input
                type="file" id="pimg" accept="image/*" onChange={handleFileChange} required={formMode === "add"}
                className="w-full p-4"
                style={{ border: "1px solid var(--color-border-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
              />
              {errors.gambar && <span className="text-[9px] text-red-500 uppercase tracking-widest mt-1">{errors.gambar[0]}</span>}
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit" disabled={submitting}
                className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
                style={{ background: "var(--color-text-primary)", color: "var(--color-text-inverted)", border: "1px solid var(--color-text-primary)" }}
                onMouseEnter={(e) => { if(!submitting){ e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-primary)"; } }}
                onMouseLeave={(e) => { if(!submitting){ e.currentTarget.style.background = "var(--color-text-primary)"; e.currentTarget.style.color = "var(--color-text-inverted)"; } }}
              >
                {submitting ? "Menyimpan..." : "Simpan Produk"}
              </button>
              <button 
                type="button" onClick={resetForm}
                className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
                style={{ background: "transparent", color: "var(--color-text-primary)", border: "1px solid var(--color-text-primary)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-text-primary)"; e.currentTarget.style.color = "var(--color-text-inverted)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {formMode === "closed" && (
        loading ? (
          <div className="text-[10px] font-bold uppercase tracking-widest">Memuat produk...</div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto pb-10">
            <table className="w-full text-left bg-white" style={{ borderCollapse: "collapse", color: "var(--color-text-primary)" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-text-primary)" }}>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Gambar</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Nama Produk</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Kategori</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Harga</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Stok</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const imageSrc = p.gambar ? (p.gambar.startsWith("http") ? p.gambar : `http://localhost:8000${p.gambar}`) : "https://via.placeholder.com/100x70?text=No+Image";
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                    <td className="p-4">
                      <img src={imageSrc} alt={p.nama_produk} className="w-16 h-16 object-cover" style={{ border: "1px solid var(--color-text-primary)" }} />
                    </td>
                    <td className="p-4">
                      <strong style={{ fontFamily: "var(--font-serif)", fontSize: "16px" }}>{p.nama_produk}</strong>
                    </td>
                    <td className="p-4 text-[10px] uppercase tracking-widest font-bold text-gray-500">{p.kategori?.nama_kategori || "Umum"}</td>
                    <td className="p-4 font-bold" style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>{formatRupiah(p.harga)}</td>
                    <td className="p-4" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{p.stok} unit</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest transition-all"
                          style={{ border: "1px solid var(--color-text-primary)", background: "transparent", color: "var(--color-text-primary)" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-text-primary)"; e.currentTarget.style.color = "var(--color-text-inverted)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.nama_produk)}
                          className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest transition-all"
                          style={{ border: "1px solid #ef4444", background: "transparent", color: "#ef4444" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "white"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ef4444"; }}
                        >
                          Hapus
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
          <div className="text-[11px] uppercase tracking-widest border p-8 bg-white" style={{ borderColor: "var(--color-text-primary)", color: "var(--color-text-primary)" }}>
            Belum ada produk di database Anda.
          </div>
        )
      )}
    </div>
  );
};

export default AdminProduk;
