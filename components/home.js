"use client"; // Kalau pakai Next.js 13/14 App Router

import { useEffect, useState } from "react";

const Home = () => {
  const [products, setProducts] = useState([]);

  // Ambil data produk dari API
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Produk</h1>
      <div className="grid gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="border p-4 rounded shadow">
              <h2 className="font-bold">{product.name}</h2>
              <p>ID Barcode: {product.barcode}</p>
              <p>Harga: Rp {product.price.toLocaleString("id-ID")}</p>
              <p>Stok: {product.qty}</p>
              <p>{product.description}</p>
            </div>
          ))
        ) : (
          <p>Tidak ada produk tersedia.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
