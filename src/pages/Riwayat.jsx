import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";

const Riwayat = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [successMsg, setSuccessMsg] = useState(location.state?.successMsg || "");
  const [uploadError, setUploadError] = useState("");
  const [selectedFile, setSelectedFile] = useState({}); // Menyimpan file berdasarkan pesanan ID
  const [uploadingId, setUploadingId] = useState(null);

  // Fetch riwayat pesanan
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

  // Handle perubahan input file untuk upload bukti
  const handleFileChange = (e, orderId) => {
    setSelectedFile({
      ...selectedFile,
      [orderId]: e.target.files[0]
    });
  };

  // Kirim file bukti transfer ke Laravel
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
      
      // Bersihkan state input file
      const updatedFiles = { ...selectedFile };
      delete updatedFiles[orderId];
      setSelectedFile(updatedFiles);

      // Re-fetch data terbaru
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

  // Helper untuk menentukan warna badge
  const getStatusPesananBadge = (status) => {
    const map = {
      Pending: "badge-warning",
      Diproses: "badge-info",
      Dikirim: "badge-primary",
      Selesai: "badge-success",
      Dibatalkan: "badge-danger"
    };
    return map[status] || "badge-secondary";
  };

  const getStatusBayarBadge = (status) => {
    const map = {
      "Belum Lunas": "badge-danger",
      "Menunggu Verifikasi": "badge-warning",
      Lunas: "badge-success"
    };
    return map[status] || "badge-secondary";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Memuat riwayat transaksi Anda...</p>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <h2>Riwayat Belanja Anda</h2>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {uploadError && <div className="alert alert-danger">{uploadError}</div>}

        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                {/* Header Kartu Pesanan */}
                <div className="order-card-header">
                  <div>
                    <span className="order-id">Pesanan #{order.id}</span>
                    <span className="order-date">Tanggal: {new Date(order.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}</span>
                  </div>
                  <div className="order-badges">
                    <span className={`badge ${getStatusPesananBadge(order.status_pesanan)}`}>
                      Status: {order.status_pesanan}
                    </span>
                    <span className={`badge ${getStatusBayarBadge(order.status_bayar)}`}>
                      Bayar: {order.status_bayar}
                    </span>
                  </div>
                </div>

                {/* Detail Item Belanjaan */}
                <div className="order-card-body">
                  <div className="ordered-items">
                    {order.detail_pesanan?.map((detail) => (
                      <div key={detail.id} className="ordered-item-line">
                        <span className="item-name">{detail.produk?.nama_produk || "Produk Terhapus"} (x{detail.kuantitas})</span>
                        <span className="item-subtotal">{formatRupiah(detail.sub_total)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="divider"></div>
                  
                  <div className="order-total-price">
                    <span>Total Tagihan:</span>
                    <span className="price-bold">{formatRupiah(order.total_harga)}</span>
                  </div>
                </div>

                {/* Bagian Aksi Upload Bukti Transfer */}
                <div className="order-card-footer">
                  {order.status_bayar === "Belum Lunas" && order.status_pesanan !== "Dibatalkan" ? (
                    <div className="upload-proof-box">
                      <p>Kirim bukti pembayaran manual:</p>
                      <div className="upload-input-group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, order.id)}
                          className="file-picker"
                        />
                        <button
                          onClick={() => handleUploadBukti(order.id)}
                          disabled={uploadingId === order.id}
                          className="upload-submit-btn"
                        >
                          {uploadingId === order.id ? "Mengunggah..." : "Kirim Struk"}
                        </button>
                      </div>
                    </div>
                  ) : order.status_bayar === "Menunggu Verifikasi" ? (
                    <div className="proof-status-info text-warning">
                      ⏳ Struk bukti transfer telah dikirim. Menunggu pencocokan mutasi bank oleh Admin.
                    </div>
                  ) : order.status_bayar === "Lunas" ? (
                    <div className="proof-status-info text-success">
                      ✅ Pembayaran Terverifikasi (Lunas). Terima kasih telah berbelanja!
                    </div>
                  ) : order.status_pesanan === "Dibatalkan" ? (
                    <div className="proof-status-info text-danger">
                      ❌ Pesanan Dibatalkan. Stok barang telah dikembalikan.
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

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
            <p>Anda belum pernah melakukan pemesanan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Riwayat;
