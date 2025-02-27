"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ProductForm = ({ barcode }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    barcodeId: barcode || "",
    name: "",
    sell_price: "",
    buy_price: "",
    qty: "",
    details: "",
  });

  const [prevProduct, setPrevProduct] = useState(null);
  const [availableStock, setAvailableStock] = useState(0); // Stok tersedia

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "name") {
      fetchExistingProduct(value);
    }
  };

  // Cegah harga jual lebih kecil dari harga beli
  const handlePriceBlur = () => {
    if (parseFloat(formData.sell_price) < parseFloat(formData.buy_price)) {
      setFormData((prev) => ({ ...prev, sell_price: prev.buy_price }));
    }
  };

  // Fetch produk berdasarkan nama
  const fetchExistingProduct = async (productName) => {
    if (productName.length < 3) return;

    try {
      const res = await fetch(`/api/products?name=${encodeURIComponent(productName)}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.product) {
          setPrevProduct(data.product);
          setAvailableStock(data.product.qty); // Update stok tersedia
        } else {
          setPrevProduct(null);
          setAvailableStock(0);
        }
      }
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
    }
  };

  // Isi form dengan data lama jika produk ditemukan
  useEffect(() => {
    if (prevProduct) {
      setFormData((prev) => ({
        ...prev,
        sell_price: prevProduct.sell_price.toString(),
        buy_price: prevProduct.buy_price.toString(),
        details: prevProduct.details || "",
      }));
    }
  }, [prevProduct]);

  // Kirim data ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.barcodeId.trim()) {
      alert("Barcode tidak boleh kosong!");
      return;
    }

    const productData = {
      barcodeId: formData.barcodeId.trim(),
      name: formData.name,
      sell_price: parseFloat(formData.sell_price) || 0,
      buy_price: parseFloat(formData.buy_price) || 0,
      qty: parseInt(formData.qty) || 0,
      details: formData.details,
    };

    console.log("Data Produk:", productData);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert("Produk berhasil disimpan!");
        router.push("/");
      } else {
        alert("Gagal menyimpan produk.");
      }
    } catch (error) {
      console.error("Error saat menyimpan produk:", error);
      alert("Terjadi kesalahan, coba lagi.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-4">
      <h2 className="text-xl font-bold mb-4">Tambah Produk</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ID Barcode */}
        <div>
          <label className="block font-semibold">ID Barcode</label>
          <input
            type="text"
            name="barcodeId"
            value={formData.barcodeId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Masukkan atau scan barcode"
          />
        </div>

        {/* Nama Produk */}
        <div>
          <label className="block font-semibold">Nama Produk</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            autoFocus
            className="w-full p-2 border rounded"
            placeholder="Masukkan nama produk"
          />
          {prevProduct && (
            <p className="text-sm text-gray-500">
              Produk sudah ada! Data harga dan deskripsi akan diisi otomatis.
            </p>
          )}
        </div>

        {/* Stok Tersedia (Readonly) */}
        {prevProduct && (
          <div>
            <label className="block font-semibold">Stok Tersedia</label>
            <input
              type="text"
              value={availableStock}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 font-bold"
            />
          </div>
        )}

        {/* Harga Beli */}
        <div>
          <label className="block font-semibold">Harga Beli (Rp)</label>
          <input
            type="number"
            name="buy_price"
            value={formData.buy_price}
            onChange={handleChange}
            required
            min="0"
            className="w-full p-2 border rounded"
            placeholder="Masukkan harga beli"
          />
        </div>

        {/* Harga Jual */}
        <div>
          <label className="block font-semibold">Harga Jual (Rp)</label>
          <input
            type="number"
            name="sell_price"
            value={formData.sell_price}
            onChange={handleChange}
            onBlur={handlePriceBlur}
            required
            className="w-full p-2 border rounded"
            placeholder="Masukkan harga jual"
          />
        </div>

        {/* Jumlah Stok */}
        <div>
          <label className="block font-semibold">Jumlah Stok</label>
          <input
            type="number"
            name="qty"
            value={formData.qty}
            onChange={handleChange}
            required
            min="1"
            className="w-full p-2 border rounded"
            placeholder="Masukkan jumlah stok"
          />
        </div>

        {/* Deskripsi Produk */}
        <div>
          <label className="block font-semibold">Deskripsi</label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Tambahkan deskripsi produk"
          />
        </div>

        {/* Tombol Simpan */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Simpan Produk
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
