import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../api/axios";

const Riwayat = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [successMsg, setSuccessMsg] = useState(location.state?.successMsg || "");
  const [uploadError, setUploadError] = useState("");
  const [selectedFile, setSelectedFile] = useState({});
  const [uploadingId, setUploadingId] = useState(null);

  const fetchOrders = async (page = 1) => {
    try {
      const response = await api.get(`/riwayat-pesanan?page=${page}`);
      setOrders(response.data.data.data || []);
      setCurrentPage(response.data.data.current_page || 1);
      setTotalPages(response.data.data.last_page || 1);
    } catch (error) {
      console.error("Gagal mengambil riwayat pesanan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handleFileChange = (e, orderId) => {
    setSelectedFile({
      ...selectedFile,
      [orderId]: e.target.files[0]
    });
  };

  const handleUploadBukti = async (orderId) => {
    const file = selectedFile[orderId];
    if (!file) {
      alert("Harap pilih file terlebih dahulu!");
      return;
    }

    setUploadingId(orderId);
    setUploadError("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("bukti_transfer", file);

    try {
      await api.post(`/pesanan/${orderId}/bukti-transfer`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setSuccessMsg("Bukti transfer berhasil diunggah! Mohon tunggu verifikasi admin.");
      
      const updatedFiles = { ...selectedFile };
      delete updatedFiles[orderId];
      setSelectedFile(updatedFiles);

      fetchOrders(currentPage);
    } catch (error) {
      console.error("Gagal mengunggah bukti:", error);
      setUploadError(error.response?.data?.message || "Gagal mengunggah gambar bukti transfer.");
    } finally {
      setUploadingId(null);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const getStatusPesananStyle = (status) => {
    const map = {
      Pending: { bg: "var(--color-bg-base)", color: "var(--color-text-primary)", border: "var(--color-border-subtle)" },
      Diproses: { bg: "#e0f2fe", color: "#0284c7", border: "#0284c7" },
      Dikirim: { bg: "#fef08a", color: "#854d0e", border: "#ca8a04" },
      Selesai: { bg: "#dcfce7", color: "#166534", border: "#16a34a" },
      Dibatalkan: { bg: "#fee2e2", color: "#991b1b", border: "#dc2626" }
    };
    return map[status] || map["Pending"];
  };

  const getStatusBayarStyle = (status) => {
    const map = {
      "Belum Lunas": { bg: "#fee2e2", color: "#991b1b", border: "#dc2626" },
      "Menunggu Verifikasi": { bg: "#fef08a", color: "#854d0e", border: "#ca8a04" },
      Lunas: { bg: "#dcfce7", color: "#166534", border: "#16a34a" }
    };
    return map[status] || { bg: "var(--color-bg-base)", color: "var(--color-text-primary)", border: "var(--color-border-subtle)" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg-base)" }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--color-text-primary)" }}>
          Memuat Riwayat...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 lg:px-24" style={{ background: "var(--color-bg-base)", color: "var(--color-text-primary)" }}>
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-[9px] uppercase tracking-widest font-bold mb-12 inline-block" style={{ color: "var(--color-text-primary)" }}>
          ← Eksplorasi
        </Link>
        
        <h1 className="mb-12" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 4vw, 4rem)", lineHeight: 1.1, textTransform: "uppercase" }}>
          Riwayat.
        </h1>

        {/* Notifikasi */}
        {successMsg && (
          <div className="mb-8 px-6 py-4 flex items-center gap-4" style={{ border: "1px solid #10b981", boxShadow: "4px 4px 0 #10b981", background: "#fff" }}>
            <span style={{ color: "#10b981", fontSize: "12px" }}>■</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
              {successMsg}
            </span>
          </div>
        )}
        
        {uploadError && (
          <div className="mb-8 px-6 py-4 flex items-center gap-4" style={{ border: "1px solid #ef4444", boxShadow: "4px 4px 0 #ef4444", background: "#fff" }}>
            <span style={{ color: "#ef4444", fontSize: "12px" }}>■</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">
              {uploadError}
            </span>
          </div>
        )}

        {orders.length > 0 ? (
          <div className="flex flex-col gap-12">
            {orders.map((order) => {
              const pesananStyle = getStatusPesananStyle(order.status_pesanan);
              const bayarStyle = getStatusBayarStyle(order.status_bayar);

              return (
                <div key={order.id} className="border p-8 md:p-12" style={{ borderColor: "var(--color-text-primary)", background: "#fff", boxShadow: "8px 8px 0 var(--color-text-primary)" }}>
                  
                  {/* Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8 mb-8" style={{ borderColor: "var(--color-border-subtle)" }}>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Order ID</span>
                      <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-mono)" }}>#{order.id.toString().padStart(4, '0')}</span>
                    </div>
                    
                    <div className="flex flex-col md:items-end gap-2 text-right">
                      <span className="text-[10px] uppercase tracking-widest font-bold">
                        {new Date(order.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest border" style={{ background: pesananStyle.bg, color: pesananStyle.color, borderColor: pesananStyle.border }}>
                          Pesanan: {order.status_pesanan}
                        </span>
                        <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest border" style={{ background: bayarStyle.bg, color: bayarStyle.color, borderColor: bayarStyle.border }}>
                          Pembayaran: {order.status_bayar}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body - Items */}
                  <div className="flex flex-col gap-4 mb-8">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest border-b pb-2 mb-2 w-max" style={{ borderColor: "var(--color-text-primary)" }}>Item Dibeli</h3>
                    {order.detail_pesanan?.map((detail) => (
                      <div key={detail.id} className="flex justify-between items-start text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                        <div className="flex flex-col pr-4">
                          <span className="font-bold uppercase">{detail.produk?.nama_produk || "Produk Terhapus"}</span>
                          <span className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>Kuantitas: {detail.kuantitas}</span>
                        </div>
                        <span className="whitespace-nowrap">{formatRupiah(detail.sub_total)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Body - Total */}
                  <div className="border-t border-b py-6 mb-8" style={{ borderColor: "var(--color-text-primary)", borderStyle: "dashed solid" }}>
                    <div className="flex justify-between items-center text-xl md:text-2xl font-bold" style={{ fontFamily: "var(--font-mono)" }}>
                      <span className="uppercase text-[12px] tracking-widest" style={{ fontFamily: "var(--font-sans)" }}>Total Tagihan</span>
                      <span>{formatRupiah(order.total_harga)}</span>
                    </div>
                  </div>

                  {/* Footer - Actions / Upload */}
                  <div className="mt-8">
                    {order.status_bayar === "Belum Lunas" && order.status_pesanan !== "Dibatalkan" ? (
                      <div className="flex flex-col gap-4 p-6 border" style={{ borderColor: "var(--color-text-primary)", background: "var(--color-bg-base)" }}>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2">Unggah Bukti Transfer</h4>
                        <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                          Silakan transfer sejumlah <strong>{formatRupiah(order.total_harga)}</strong> ke rekening BCA 1234567890 (Canvas Space), lalu unggah bukti pada kolom di bawah.
                        </p>
                        
                        <div className="flex flex-col md:flex-row gap-4 mt-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, order.id)}
                            className="flex-1 bg-white p-3 border cursor-pointer text-xs"
                            style={{ borderColor: "var(--color-text-primary)", fontFamily: "var(--font-mono)" }}
                          />
                          <button
                            onClick={() => handleUploadBukti(order.id)}
                            disabled={uploadingId === order.id}
                            className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
                            style={{ background: "var(--color-text-primary)", color: "var(--color-text-inverted)", border: "1px solid var(--color-text-primary)" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-text-primary)"; e.currentTarget.style.color = "var(--color-text-inverted)"; }}
                          >
                            {uploadingId === order.id ? "Mengunggah..." : "Kirim Struk"}
                          </button>
                        </div>
                      </div>
                    ) : order.status_bayar === "Menunggu Verifikasi" ? (
                      <div className="p-4 border" style={{ borderColor: "#ca8a04", background: "#fef08a", color: "#854d0e" }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-center">⏳ Menunggu Verifikasi Admin</p>
                      </div>
                    ) : order.status_bayar === "Lunas" ? (
                      <div className="p-4 border" style={{ borderColor: "#16a34a", background: "#dcfce7", color: "#166534" }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-center">✅ Pembayaran Terverifikasi</p>
                      </div>
                    ) : order.status_pesanan === "Dibatalkan" ? (
                      <div className="p-4 border" style={{ borderColor: "#dc2626", background: "#fee2e2", color: "#991b1b" }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-center">❌ Pesanan Dibatalkan</p>
                      </div>
                    ) : null}
                  </div>

                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-3 border text-[10px] font-bold uppercase tracking-widest disabled:opacity-30"
                  style={{ borderColor: "var(--color-text-primary)" }}
                >
                  ←
                </button>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 border text-[10px] font-bold uppercase tracking-widest disabled:opacity-30"
                  style={{ borderColor: "var(--color-text-primary)" }}
                >
                  →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 text-center border" style={{ borderColor: "var(--color-border-subtle)" }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6" style={{ color: "var(--color-text-muted)" }}>Anda belum memiliki riwayat pesanan.</p>
            <Link to="/" className="text-[10px] font-bold uppercase tracking-widest border-b" style={{ borderColor: "var(--color-text-primary)" }}>
              Mulai Belanja
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Riwayat;
