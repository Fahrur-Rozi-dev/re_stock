"use client";

import { useState } from "react";
import BarcodeScanner from "../scan/page";
import { useRouter } from "next/navigation"; // Import useRouter untuk redirect


const SellPage = () => {
  const router = useRouter();
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch product by barcode
  const fetchProduct = async () => {
    if (!barcode) {
      setMessage("Harap masukkan atau scan barcode!");
      return;
    }

    setLoading(true);
    setMessage("Mencari produk...");

    try {
      const res = await fetch(`/api/products/barcode/${barcode}`);

      if (!res.ok) {
        throw new Error("Produk tidak ditemukan!");
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Format response tidak valid!");
      }

      const data = await res.json();
      setProduct(data);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle penjualan produk
  const handleSell = async () => {
    if (!product) {
      setMessage("Produk belum dipilih!");
      return;
    }

    if (qty <= 0 || qty > product.qty) {
      setMessage("Jumlah tidak valid!");
      return;
    }

    setLoading(true);
    setMessage("Memproses penjualan...");

    try {
      const res = await fetch("/api/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcodeId: barcode, qty }),
      });

      if (!res.ok) {
        throw new Error("Gagal menjual produk!");
      }

      const data = await res.json();
      setMessage("Penjualan berhasil!");
      router.push("/");

      // Reset state setelah jual
      setProduct(null);
      setBarcode("");
      setQty(1);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-xl font-bold mb-4">Jual Produk</h2>
      <BarcodeScanner onDetected={(code) => setBarcode(code)} />

      {/* Input Barcode */}
      <input
        type="text"
        placeholder="Scan / Masukkan Barcode"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={fetchProduct}
        disabled={loading}
        className={`w-full p-2 rounded ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
      >
        {loading ? "Mencari..." : "Cari Produk"}
      </button>

      {/* Tampilkan Data Produk */}
      {product && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-bold">{product.name}</h3>
          <p>Harga: Rp {product.price.toLocaleString("id-ID")}</p>
          <p>Stok: {product.qty} pcs</p>

          {/* Input Jumlah yang Dijual */}
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            min="1"
            max={product.qty}
            className="w-full p-2 border rounded mt-2"
          />

          <button
            onClick={handleSell}
            disabled={loading}
            className={`w-full p-2 mt-2 rounded ${loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"} text-white`}
          >
            {loading ? "Memproses..." : "Jual Produk"}
          </button>

          <button
            onClick={() => {
              setProduct(null);
              setBarcode("");
              setQty(1);
              setMessage("");
            }}
            className="w-full bg-gray-500 text-white p-2 mt-2 rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default SellPage;
