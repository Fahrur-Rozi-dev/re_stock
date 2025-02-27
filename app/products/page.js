"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products/get-all");
        const data = await res.json();

        if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
          console.error("Data produk tidak valid:", data);
        }
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // Fungsi untuk menghapus produk
  const deleteProduct = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

    try {
      const res = await fetch(`/api/products/delete/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setProducts((prev) => prev.filter((product) => product._id !== id));
      } else {
        alert("Gagal menghapus produk: " + data.message);
      }
    } catch (error) {
      console.error("Gagal menghapus produk:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          📦 Daftar Produk
        </h1>
        <button
          onClick={() => router.push("/")}
          className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 shadow-md"
        >
          ⬅️ Kembali
        </button>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
            >
              {/* Nama Produk & Barcode */}
              <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
              <p className="text-sm text-gray-500">Barcode: {product.barcodeIds.join(", ")}</p>

              {/* Harga & Profit */}
              <div className="mt-3">
                <p className="text-gray-700 font-medium">
                  💰 Harga Jual: Rp {product.sell_price.toLocaleString("id-ID")}
                </p>
                <p className="text-gray-500 text-sm">
                  🏷️ Harga Beli Rata-rata: Rp {product.avg_harga_beli.toLocaleString("id-ID")}
                </p>
                <p className="text-green-600 text-sm font-semibold">
                  📈 Keuntungan per Item: Rp {product.profit.toLocaleString("id-ID")}
                </p>
              </div>

              {/* Stok & Profit */}
              <div className="mt-3">
                <p
                  className={`text-sm font-semibold ${
                    product.qty <= 5 ? "text-red-500" : "text-green-600"
                  }`}
                >
                  📦 Stok: {product.qty} {product.qty <= 5 && "(Hampir Habis)"}
                </p>
                <p className="text-blue-600 text-sm font-semibold">
                  👒 Total Profit: Rp {product.total_profit.toLocaleString("id-ID")}
                </p>
                <p className="text-purple-600 text-sm font-semibold">
                  💵 Realized Profit: Rp {product.realized_profit?.toLocaleString("id-ID") || 0}
                </p>
              </div>

              {/* Tombol Aksi */}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => router.push(`/edit/${product._id}`)}
                  className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition flex-1 mr-2"
                >
                  ✏ Edit
                </button>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition flex-1"
                >
                  🗑 Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            ❌ Belum ada produk tersedia.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
