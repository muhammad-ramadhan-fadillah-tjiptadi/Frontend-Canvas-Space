import { useState, useEffect } from "react";
import api from "../api/axios";

const AdminKategori = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState({});

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
        setSuccessMsg("Kategori baru berhasil ditambahkan.");
      } else if (formMode === "edit") {
        await api.put(`/kategori/${editId}`, { nama_kategori: namaKategori });
        setSuccessMsg("Kategori berhasil diperbarui.");
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      setErrors(error.response?.data?.errors || { general: [error.response?.data?.message || "Gagal menyimpan kategori."] });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus kategori '${name}'? Ini akan berpotensi merusak produk di bawah kategori ini.`)) return;
    setSuccessMsg("");
    try {
      await api.delete(`/kategori/${id}`);
      setSuccessMsg(`Kategori '${name}' berhasil dihapus.`);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus kategori.");
    }
  };

  return (
    <div className="min-h-screen p-8 md:p-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 4vw, 4rem)", lineHeight: 1.1, textTransform: "uppercase", color: "var(--color-text-primary)" }}>
            Manajemen<br/>Kategori.
          </h2>
          <p className="mt-4 text-[11px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            Kelola klasifikasi kategori furniture
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
            + Tambah Kategori
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
            <h3 className="text-[14px] font-bold uppercase tracking-[0.2em]">{formMode === "add" ? "Tambah Kategori Baru" : "Edit Kategori"}</h3>
            <button onClick={resetForm} className="text-xl hover:scale-110 transition-transform">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <label htmlFor="catname" className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Nama Kategori</label>
              <input
                type="text" id="catname" value={namaKategori} onChange={(e) => setNamaKategori(e.target.value)} placeholder="Misal: Kursi, Meja..." required
                className="w-full bg-transparent outline-none p-4 transition-all"
                style={{ border: "1px solid var(--color-border-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px" }}
                onFocus={(e) => e.target.style.border = "1px solid var(--color-text-primary)"}
                onBlur={(e) => e.target.style.border = "1px solid var(--color-border-subtle)"}
              />
              {errors.nama_kategori && <span className="text-[9px] text-red-500 uppercase tracking-widest mt-1">{errors.nama_kategori[0]}</span>}
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit" disabled={submitting}
                className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
                style={{ background: "var(--color-text-primary)", color: "var(--color-text-inverted)", border: "1px solid var(--color-text-primary)" }}
                onMouseEnter={(e) => { if(!submitting){ e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-primary)"; } }}
                onMouseLeave={(e) => { if(!submitting){ e.currentTarget.style.background = "var(--color-text-primary)"; e.currentTarget.style.color = "var(--color-text-inverted)"; } }}
              >
                {submitting ? "Menyimpan..." : "Simpan Kategori"}
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
          <div className="text-[10px] font-bold uppercase tracking-widest">Memuat kategori...</div>
        ) : categories.length > 0 ? (
          <div className="overflow-x-auto pb-10">
            <table className="w-full text-left bg-white" style={{ borderCollapse: "collapse", color: "var(--color-text-primary)" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-text-primary)" }}>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold">ID</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Nama Kategori</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Tanggal Dibuat</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                  <td className="p-4" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>#{cat.id}</td>
                  <td className="p-4">
                    <strong style={{ fontFamily: "var(--font-serif)", fontSize: "16px" }}>{cat.nama_kategori}</strong>
                  </td>
                  <td className="p-4" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                    {new Date(cat.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest transition-all"
                        style={{ border: "1px solid var(--color-text-primary)", background: "transparent", color: "var(--color-text-primary)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-text-primary)"; e.currentTarget.style.color = "var(--color-text-inverted)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.nama_kategori)}
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
              ))}
            </tbody>
          </table>
        </div>
        ) : (
          <div className="text-[11px] uppercase tracking-widest border p-8 bg-white" style={{ borderColor: "var(--color-text-primary)", color: "var(--color-text-primary)" }}>
            Belum ada kategori furniture yang dibuat.
          </div>
        )
      )}
    </div>
  );
};

export default AdminKategori;
