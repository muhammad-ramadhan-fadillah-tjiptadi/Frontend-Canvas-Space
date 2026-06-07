import { useState, useEffect } from "react";
import api from "../api/axios";

const AdminPesanan = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeProofUrl, setActiveProofUrl] = useState(null);
  const [exporting, setExporting] = useState(false);

  const handleExportExcel = async () => {
    setExporting(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const response = await api.get("/admin/pesanan/export", {
        responseType: "blob",
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `laporan-pesanan-${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccessMsg("Data pesanan berhasil diekspor ke Excel.");
    } catch (error) {
      console.error("Gagal mengekspor data Excel:", error);
      setErrorMsg("Gagal mengekspor data pesanan ke Excel.");
    } finally {
      setExporting(false);
    }
  };

  const fetchAllOrders = async (page = 1) => {
    try {
      const response = await api.get(`/admin/pesanan?page=${page}`);
      setOrders(response.data.data.data || []);
      setCurrentPage(response.data.data.current_page || 1);
      setTotalPages(response.data.data.last_page || 1);
    } catch (error) {
      console.error("Gagal mengambil daftar pesanan admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders(currentPage);
  }, [currentPage]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const response = await api.put(`/admin/pesanan/${orderId}/status`, { status: newStatus });
      setSuccessMsg(response.data.message);
      fetchAllOrders(currentPage);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Gagal memperbarui status pesanan.");
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number);
  };

  const getAllowedStatusOptions = (currentStatus) => {
    const map = {
      Pending: ["Diproses", "Dibatalkan"],
      Diproses: ["Dikirim", "Dibatalkan"],
      Dikirim: ["Selesai"],
      Selesai: [],
      Dibatalkan: []
    };
    return map[currentStatus] || [];
  };

  return (
    <div className="min-h-screen p-8 md:p-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 4vw, 4rem)", lineHeight: 1.1, textTransform: "uppercase", color: "var(--color-text-primary)" }}>
            Pesanan<br/>Masuk.
          </h2>
          <p className="mt-4 text-[11px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            Kelola dan verifikasi pesanan
          </p>
        </div>
        
        <button 
          onClick={handleExportExcel} 
          disabled={exporting}
          className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50"
          style={{ border: "1px solid var(--color-text-primary)", background: "var(--color-text-primary)", color: "var(--color-text-inverted)" }}
          onMouseEnter={(e) => { if(!exporting){ e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-primary)"; e.currentTarget.style.boxShadow = "4px 4px 0 var(--color-text-primary)"; } }}
          onMouseLeave={(e) => { if(!exporting){ e.currentTarget.style.background = "var(--color-text-primary)"; e.currentTarget.style.color = "var(--color-text-inverted)"; e.currentTarget.style.boxShadow = "none"; } }}
        >
          {exporting ? "Mengekspor..." : "Ekspor Excel"}
        </button>
      </div>

      {successMsg && (
        <div className="mb-8 px-6 py-4 flex items-center gap-4 bg-white" style={{ border: "1px solid #10b981", boxShadow: "4px 4px 0 #10b981" }}>
          <span style={{ color: "#10b981", fontSize: "12px" }}>■</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mb-8 px-6 py-4 flex items-center gap-4 bg-white" style={{ border: "1px solid #ef4444", boxShadow: "4px 4px 0 #ef4444" }}>
          <span style={{ color: "#ef4444", fontSize: "12px" }}>■</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-primary)" }}>Memuat daftar pesanan...</div>
      ) : orders.length > 0 ? (
        <div className="overflow-x-auto pb-10">
          <table className="w-full text-left" style={{ borderCollapse: "collapse", color: "var(--color-text-primary)" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-text-primary)" }}>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">ID</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">Pelanggan</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">Tanggal</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">Total</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">Status</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">Bayar</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">Bukti</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const allowedOptions = getAllowedStatusOptions(order.status_pesanan);
                return (
                  <tr key={order.id} style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                    <td className="p-4" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>#{order.id}</td>
                    <td className="p-4 flex flex-col gap-1">
                      <strong style={{ fontFamily: "var(--font-serif)", fontSize: "14px" }}>{order.user?.nama || "Terhapus"}</strong>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-text-muted)" }}>{order.user?.email || "-"}</span>
                    </td>
                    <td className="p-4 whitespace-nowrap" style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                      {new Date(order.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-4 font-bold whitespace-nowrap" style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>{formatRupiah(order.total_harga)}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-widest" style={{ border: "1px solid var(--color-text-primary)" }}>
                        {order.status_pesanan}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-widest" style={{ border: "1px solid var(--color-text-primary)" }}>
                        {order.status_bayar}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {order.bukti_transfer ? (
                        <button
                          onClick={() => setActiveProofUrl(`http://localhost:8000/storage/${order.bukti_transfer}`)}
                          className="text-[10px] font-bold uppercase tracking-widest underline hover:opacity-70" style={{ color: "var(--color-text-primary)" }}
                        >
                          Lihat Bukti
                        </button>
                      ) : (
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>-</span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {allowedOptions.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {allowedOptions.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleUpdateStatus(order.id, opt)}
                              className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest transition-all"
                              style={{ border: "1px solid var(--color-text-primary)", background: "transparent", color: "var(--color-text-primary)" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-text-primary)"; e.currentTarget.style.color = "var(--color-text-inverted)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
                            >
                              Set {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Final</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-between items-center" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-text-primary)" }}>
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="uppercase font-bold underline disabled:opacity-30">Sebelumnya</button>
              <span>Hal {currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="uppercase font-bold underline disabled:opacity-30">Berikutnya</button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-[11px] uppercase tracking-widest border p-8" style={{ borderColor: "var(--color-text-primary)", color: "var(--color-text-primary)" }}>
          Belum ada transaksi pembelian masuk.
        </div>
      )}

      {/* Modal Bukti Transfer */}
      {activeProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setActiveProofUrl(null)}>
          <div className="relative bg-white max-w-2xl w-full max-h-[90vh] flex flex-col" style={{ border: "1px solid var(--color-text-primary)", boxShadow: "12px 12px 0 var(--color-text-primary)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: "var(--color-text-primary)" }}>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-black">Bukti Transfer</h3>
              <button className="text-xl font-bold hover:scale-110 transition-transform text-black" onClick={() => setActiveProofUrl(null)}>✕</button>
            </div>
            <div className="p-6 overflow-auto flex items-center justify-center bg-gray-100 min-h-[300px]">
              <img src={activeProofUrl} alt="Struk Transfer" className="max-w-full max-h-[70vh] object-contain border border-black" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPesanan;
