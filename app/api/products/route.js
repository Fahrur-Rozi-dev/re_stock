import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    let { barcodeId, name, price, qty, details } = body;

    qty = Number(qty); // Pastikan qty jadi angka agar tidak ada kesalahan penjumlahan

    // Cek apakah produk dengan nama yang sama sudah ada
    let existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      // Jika barcode belum ada di array, tambahkan
      if (!existingProduct.barcodeIds.includes(barcodeId)) {
        existingProduct.barcodeIds.push(barcodeId);
      }

      // Tambahkan stok qty
      existingProduct.qty += qty;

      // Update harga & detail (jika ingin diupdate)
      existingProduct.price = price;
      existingProduct.details = details;

      await existingProduct.save();

      return NextResponse.json(
        { message: "Stok & barcode produk diperbarui!", data: existingProduct },
        { status: 200 }
      );
    }

    // Jika produk belum ada, buat baru
    const newProduct = new Product({
      barcodeIds: [barcodeId], // Simpan dalam array
      name,
      price,
      qty,
      details
    });

    await newProduct.save();

    return NextResponse.json(
      { message: "Produk baru berhasil disimpan!", data: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error menyimpan produk:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan produk", error },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   try {
//     await dbConnect();
//     const products = await Product.find(); // Ambil semua data produk
//     return NextResponse.json({ data: products }, { status: 200 });
//   } catch (error) {
//     console.error("Error mengambil produk:", error);
//     return NextResponse.json({ message: "Gagal mengambil produk", error }, { status: 500 });
//   }
// }


export async function GET() {
  try {
    await dbConnect();

    // Ambil semua produk
    const products = await Product.find({}, "name barcodeIds price qty details");

    return NextResponse.json({ message: "Produk ditemukan", data: products }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengambil produk", error: error.message },
      { status: 500 }
    );
  }
}

