"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EditProduct = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [formData, setFormData] = useState({
    barcodeIds: [],
    name: "",
    sell_price: "",
    buy_price: "",
    qty: "",
    details: "",
    avg_harga_beli: "",
    total_profit: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);

        if (!res.ok) {
          throw new Error(`Gagal mengambil data: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      profit: formData.sell_price - formData.buy_price,
      total_profit: (formData.sell_price - formData.buy_price) * formData.qty,
      avg_harga_beli: formData.buy_price,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Produk berhasil diperbarui!");
      router.push("/");
    } else {
      alert("Gagal memperbarui produk");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-4">
      <h2 className="text-xl font-bold mb-4">Edit Produk</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Nama Produk" required />
        <input type="number" name="buy_price" value={formData.buy_price} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Harga Beli" required />
        <input type="number" name="sell_price" value={formData.sell_price} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Harga Jual" required />
        <input type="number" name="qty" value={formData.qty} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Jumlah Stok" required />
        <textarea name="details" value={formData.details} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Deskripsi Produk" />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">Simpan Perubahan</button>
      </form>
    </div>
  );
};

export default EditProduct;
