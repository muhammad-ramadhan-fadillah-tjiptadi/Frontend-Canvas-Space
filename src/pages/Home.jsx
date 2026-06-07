import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/produk"),
          api.get("/kategori"),
        ]);
        setProducts(prodRes.data.data.data || prodRes.data.data || []);
        setCategories(catRes.data.data || []);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Fix refresh behavior: scroll to top and clear any hash
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const filtered = products.filter((p) => {
    const byCategory =
      selectedCategory === "all" ||
      p.kategori_id === parseInt(selectedCategory);
    const bySearch =
      p.nama_produk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.deskripsi || "").toLowerCase().includes(searchQuery.toLowerCase());
    return byCategory && bySearch;
  });

  return (
    <div style={{ background: "var(--color-bg-base)", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section
        className="w-full flex items-center relative overflow-hidden"
        style={{ minHeight: "100vh", background: "var(--color-bg-base)" }}
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left Column: Giant Editorial Title */}
          <div>
            <h1
              className="font-bold leading-[0.88] select-none"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
                color: "var(--color-text-primary)",
                letterSpacing: "-0.03em",
              }}
            >
              Simple
              <br />
              <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--color-text-primary)" }}>Pieces.</em>
            </h1>
          </div>

          {/* Right Column: Premium Text Content & Action */}
          <div className="flex flex-col items-start max-w-md">
            <p
              className="text-[9px] font-bold uppercase tracking-[0.35em] mb-6 px-3 py-1"
              style={{ background: "var(--color-text-primary)", color: "var(--color-text-inverted)" }}
            >
              Canvas Space — Est. Bogor
            </p>

            <p
              className="mb-10"
              style={{
                color: "var(--color-text-primary)",
                fontSize: "1rem",
                fontWeight: 500,
                lineHeight: 1.75,
              }}
            >
              Furniture minimalis untuk ruang hidup modern — bersih, fungsional, dan abadi. Setiap unit dirancang dengan detail presisi untuk kenyamanan dan keindahan rumah Anda.
            </p>

            <a
              href="#katalog"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-3 text-[0.65rem] tracking-[0.22em] font-bold uppercase py-4 px-8 transition-all duration-300 ease-out"
              style={{
                background: "var(--color-text-primary)",
                color: "var(--color-text-inverted)",
                fontFamily: "var(--font-sans)",
                border: "1px solid var(--color-text-primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-bg-base)";
                e.currentTarget.style.color = "var(--color-text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-text-primary)";
                e.currentTarget.style.color = "var(--color-text-inverted)";
              }}
            >
              Jelajahi Koleksi →
            </a>
          </div>
        </div>
      </section>

      {/* ── CATALOG ── */}
      <main id="katalog" className="scroll-mt-20">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-20">

          {/* Heading + Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p
                className="text-[9px] font-bold uppercase tracking-[0.3em] mb-3 px-2 py-1 inline-block"
                style={{ background: "var(--color-text-primary)", color: "var(--color-text-inverted)" }}
              >
                Katalog
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  lineHeight: 1.2,
                }}
              >
                Temukan Piece{" "}
                <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--color-text-primary)" }}>
                  yang Sempurna
                </em>
              </h2>
            </div>

            <div className="relative w-full md:w-72">
              <input
                type="search"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-4 text-xs outline-none transition-all placeholder:text-gray-400"
                style={{
                  background: "var(--color-text-primary)",
                  color: "var(--color-text-inverted)",
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.04em",
                  border: "none",
                }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div
            className="flex flex-wrap gap-3 mb-16 pb-8"
            style={{ borderBottom: "2px solid var(--color-text-primary)" }}
          >
            {[{ id: "all", nama_kategori: "Semua" }, ...categories].map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-sans)",
                    padding: "0.6rem 1.25rem",
                    border: "1px solid var(--color-text-primary)",
                    color: active
                      ? "var(--color-bg-base)"
                      : "var(--color-text-inverted)",
                    background: active ? "var(--color-text-primary)" : "#2a2724", // Darker subtle variant if not active
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "var(--color-text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "#2a2724";
                    }
                  }}
                >
                  {cat.nama_kategori}
                </button>
              );
            })}
          </div>

          {/* Products */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array(8).fill(null).map((_, i) => (
                <div key={i} className="flex flex-col gap-0 animate-pulse bg-[var(--color-text-primary)]">
                  <div style={{ aspectRatio: "4/5", background: "rgba(255,255,255,0.1)" }} />
                  <div className="p-5 flex flex-col gap-3">
                    <div className="h-2 w-16 rounded" style={{ background: "rgba(255,255,255,0.2)" }} />
                    <div className="h-3 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.2)" }} />
                    <div className="h-3 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.2)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filtered.map((produk) => {
                const img = produk.gambar
                  ? produk.gambar.startsWith("http")
                    ? produk.gambar
                    : `http://localhost:8000${produk.gambar}`
                  : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format";

                return (
                  <article key={produk.id} className="group relative flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2" style={{ background: "var(--color-text-primary)" }}>
                    {/* Image Container */}
                    <div
                      className="relative overflow-hidden"
                      style={{
                        aspectRatio: "4/5",
                        background: "#111",
                      }}
                    >
                      <img
                        src={img}
                        alt={produk.nama_produk}
                        loading="lazy"
                        className="w-full h-full object-cover grayscale opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
                      />
                      {/* Floating Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {produk.stok === 0 && (
                          <span
                            className="text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 shadow-sm"
                            style={{
                              background: "var(--color-bg-base)",
                              color: "var(--color-text-primary)",
                            }}
                          >
                            Habis
                          </span>
                        )}
                        <span
                          className="text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 shadow-sm opacity-0 transform -translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0"
                          style={{
                            background: "var(--color-text-inverted)",
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {produk.kategori?.nama_kategori || "Furniture"}
                        </span>
                      </div>
                    </div>

                    {/* Dark Info Section */}
                    <div className="p-6 flex flex-col flex-grow relative z-10 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      <div className="flex justify-between items-start mb-6 gap-4">
                        <h3
                          className="text-lg leading-snug"
                          style={{ 
                            color: "var(--color-text-inverted)",
                            fontFamily: "var(--font-serif)",
                            fontWeight: 500
                          }}
                        >
                          {produk.nama_produk}
                        </h3>
                        <p
                          className="text-[10px] font-bold tracking-widest text-right mt-1"
                          style={{ color: "var(--color-text-inverted)" }}
                        >
                          {formatRupiah(produk.harga)}
                        </p>
                      </div>
                      
                      <Link
                        to={`/produk/${produk.id}`}
                        className="mt-auto flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em] pt-5 transition-all duration-300"
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          borderTop: "1px solid rgba(255,255,255,0.1)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--color-text-inverted)";
                          e.currentTarget.style.borderColor = "var(--color-text-inverted)";
                          e.currentTarget.querySelector('.arrow-icon').style.transform = "translateX(6px)";
                          e.currentTarget.querySelector('.arrow-icon').style.color = "var(--color-text-inverted)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                          e.currentTarget.querySelector('.arrow-icon').style.transform = "translateX(0)";
                          e.currentTarget.querySelector('.arrow-icon').style.color = "rgba(255,255,255,0.5)";
                        }}
                      >
                        <span>Lihat Detail</span>
                        <span className="arrow-icon transform transition-all duration-300 text-base leading-none" style={{ color: "rgba(255,255,255,0.5)" }}>→</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24" style={{ background: "var(--color-text-primary)", color: "var(--color-text-inverted)" }}>
              <p
                className="text-xs uppercase tracking-widest"
              >
                Tidak ada produk ditemukan.
              </p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <p
              className="text-center mt-16 text-[9px] font-bold uppercase tracking-[0.25em]"
              style={{ color: "var(--color-text-primary)" }}
            >
              — {filtered.length} produk ditampilkan —
            </p>
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer
        className="px-8 md:px-16 py-12 mt-10"
        style={{ background: "var(--color-text-primary)", color: "var(--color-text-inverted)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.5rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Canvas Space
          </p>
          <div className="flex gap-8">
            <p
              className="text-[9px] uppercase tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Est. 2026
            </p>
            <p
              className="text-[9px] uppercase tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
