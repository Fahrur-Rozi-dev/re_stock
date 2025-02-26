import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json(); // Ambil data dari request body

    // Simpan data ke database
    const newProduct = new Product(body);
    await newProduct.save();

    return NextResponse.json({ message: "Produk berhasil disimpan!", data: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Error menyimpan produk:", error);
    return NextResponse.json({ message: "Gagal menyimpan produk", error }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find(); // Ambil semua data produk
    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error) {
    console.error("Error mengambil produk:", error);
    return NextResponse.json({ message: "Gagal mengambil produk", error }, { status: 500 });
  }
}


