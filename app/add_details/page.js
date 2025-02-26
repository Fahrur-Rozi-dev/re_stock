"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter untuk redirect

const ProductForm = ({ barcode }) => {
  const router = useRouter(); // Inisialisasi router

  const [formData, setFormData] = useState({
    barcodeId: barcode || "",
    name: "",
    price: "",
    qty: "",
    details: "",
  });

  // Handle perubahan input form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hitung total harga otomatis (convert ke number dulu)
  const totalPrice = (Number(formData.price) * Number(formData.qty)) || 0;

  // Simpan produk (bisa disambungkan ke backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = { ...formData, totalPrice };

    console.log("Data Produk:", productData);

    try {
      // TODO: Kirim data ke backend API (MongoDB)
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert("Produk berhasil disimpan!");
        router.push("/"); // Redirect ke halaman utama

      }
      else if (response.status === 500) {
        alert("Produk dengan ID tersebut sudah ada.")
      } 
      else {
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
        {/* ID Barcode (diisi otomatis dari hasil scan) */}
        <div>
          <label className="block font-semibold">ID Barcode</label>
          <input
            type="text"
            name="barcode"
            value={formData.barcodeId}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        {/* Nama Produk */}
        <div>
          <label className="block font-semibold">Nama Item</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Masukkan nama produk"
          />
        </div>

        {/* Harga */}
        <div>
          <label className="block font-semibold">Harga (Rp)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Masukkan harga"
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
            className="w-full p-2 border rounded"
            placeholder="Masukkan jumlah stok"
          />
        </div>

        {/* Total Harga (otomatis dihitung) */}
        <div>
          <label className="block font-semibold">Total Harga (Rp)</label>
          <input
            type="text"
            value={totalPrice.toLocaleString("id-ID")}
            readOnly
            className="w-full p-2 border rounded bg-gray-100 font-bold"
          />
        </div>

        {/* Deskripsi Produk */}
        <div>
          <label className="block font-semibold">Deskripsi</label>
          <textarea
            name="description"
            value={formData.description}
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
