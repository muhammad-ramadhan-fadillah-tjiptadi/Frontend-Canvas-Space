import { useState, useEffect } from "react";
import api from "../api/axios";

const AdminPesanan = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Modal State untuk melihat bukti transfer
  const [activeProofUrl, setActiveProofUrl] = useState(null);

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

  // Mengubah status pesanan
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Apakah Anda yakin ingin mengubah status pesanan menjadi '${newStatus}'?`)) {
      return;
    }

    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await api.put(`/admin/pesanan/${orderId}/status`, {
        status: newStatus,
      });
      setSuccessMsg(response.data.message);
      
      // Re-fetch data terbaru
      fetchAllOrders(currentPage);
    } catch (error) {
      console.error("Gagal mengubah status:", error);
      setErrorMsg(error.response?.data?.message || "Gagal memperbarui status pesanan.");
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Helper untuk menentukan opsi transisi status yang valid
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
    <div className="admin-page">
      <div className="admin-container">
        <h2>Dashboard Admin: Pesanan Masuk</h2>
        <p className="admin-subtitle">Kelola dan verifikasi pesanan furniture masuk dari semua pelanggan</p>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Memuat daftar pesanan...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="admin-orders-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pelanggan</th>
                  <th>Tanggal</th>
                  <th>Total Tagihan</th>
                  <th>Status Pesanan</th>
                  <th>Status Bayar</th>
                  <th>Bukti</th>
                  <th>Aksi Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const allowedOptions = getAllowedStatusOptions(order.status_pesanan);
                  
                  return (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        <div className="table-user-details">
                          <strong>{order.user?.nama || "Pelanggan Terhapus"}</strong>
                          <span>{order.user?.email || "-"}</span>
                        </div>
                      </td>
                      <td>
                        {new Date(order.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="table-price">{formatRupiah(order.total_harga)}</td>
                      <td>
                        <span className={`table-badge badge-status-${order.status_pesanan.toLowerCase()}`}>
                          {order.status_pesanan}
                        </span>
                      </td>
                      <td>
                        <span className={`table-badge badge-payment-${order.status_bayar.replace(/\s+/g, '-').toLowerCase()}`}>
                          {order.status_bayar}
                        </span>
                      </td>
                      <td>
                        {order.bukti_transfer ? (
                          <button
                            onClick={() => setActiveProofUrl(`http://localhost:8000/storage/${order.bukti_transfer}`)}
                            className="view-proof-btn"
                          >
                            👁️ Lihat Bukti
                          </button>
                        ) : (
                          <span className="no-proof">-</span>
                        )}
                      </td>
                      <td>
                        {allowedOptions.length > 0 ? (
                          <div className="action-buttons-group">
                            {allowedOptions.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => handleUpdateStatus(order.id, opt)}
                                className={`status-action-btn btn-${opt.toLowerCase()}`}
                              >
                                Set {opt}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted">Final (Selesai/Batal)</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </button>
                <span className="page-info">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <p>Belum ada transaksi pembelian masuk.</p>
          </div>
        )}
      </div>

      {/* Modal Tampilan Bukti Transfer (Glassmorphism Modal) */}
      {activeProofUrl && (
        <div className="modal-backdrop" onClick={() => setActiveProofUrl(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Bukti Transfer Pembayaran</h3>
              <button className="close-modal-btn" onClick={() => setActiveProofUrl(null)}>×</button>
            </div>
            <div className="modal-body">
              <img src={activeProofUrl} alt="Struk Transfer Pembayaran" className="proof-full-img" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPesanan;
