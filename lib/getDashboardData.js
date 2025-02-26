"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();

        if (res.ok) {
          setDashboardData(data.data);
        } else {
          setError(data.message || "Gagal mengambil data.");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        📊 Dashboard
      </h1>

      {/* Tombol Aksi */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => router.push("/add_product")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center gap-2"
        >
          ➕ Tambah Produk
        </button>
        <button
          onClick={() => router.push("/sell_product")}
          className="bg-red-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-700 transition flex items-center gap-2"
        >
          🛒 Jual Produk
        </button>
      </div>

      {/* Total Value */}
<div className="p-5 bg-gray-800 text-white rounded-lg shadow-md mb-6">
  <h2 className="text-lg font-semibold">💰 Total Value</h2>
  <p>Rp {dashboardData?.totalValue?.toLocaleString("id-ID") || 0}
  </p>
</div>

      {/* Status Loading & Error */}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Produk */}
          <div className="p-5 bg-blue-500 text-white rounded-lg shadow-md" onClick={() => router.push("/products")}>
            <h2 className="text-lg font-semibold">Total Produk</h2>
            <p className="text-3xl font-bold">{dashboardData.totalProducts}</p>
          </div>

          {/* Total Stok */}
          <div className="p-5 bg-green-500 text-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Stok</h2>
            <p className="text-3xl font-bold">{dashboardData.totalStock}</p>
          </div>

          {/* Produk Stok Rendah */}
          {dashboardData.lowStockProducts.length > 0 && (
            <div className="p-5 bg-yellow-500 text-white rounded-lg shadow-md col-span-1 md:col-span-2">
              <h2 className="text-lg font-semibold">⚠️ Stok Hampir Habis</h2>
              <ul className="mt-2 space-y-1">
                {dashboardData.lowStockProducts.map((product) => (
                  <li key={product._id} className="text-lg">
                    {product.name} <span className="font-bold">({product.qty} tersisa)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Produk Stok Terbanyak */}
          {dashboardData.highStockProduct && (
            <div className="p-5 bg-purple-500 text-white rounded-lg shadow-md col-span-1 md:col-span-2">
              <h2 className="text-lg font-semibold">🔥 Produk dengan Stok Terbanyak</h2>
              <p className="text-xl font-bold mt-2">
                {dashboardData.highStockProduct.name} ({dashboardData.highStockProduct.qty} tersedia)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
