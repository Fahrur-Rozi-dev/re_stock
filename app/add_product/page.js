"use client";

import { useState } from "react";
import BarcodeScanner from "../scan/page";
import ProductForm from "../add_details/page";

export default function Home() {
  const [barcode, setBarcode] = useState(""); // Simpan ID barcode yang terdeteksi

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Scan & Tambah Produk</h1>

      {/* Scanner */}
      <BarcodeScanner onDetected={(code) => setBarcode(code)} />

      {/* Form Produk (hanya tampil jika barcode sudah terdeteksi) */}
      {barcode && <ProductForm barcode={barcode} />}
    </main>
  );
}
