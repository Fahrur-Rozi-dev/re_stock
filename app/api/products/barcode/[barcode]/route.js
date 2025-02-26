import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

// CARI PRODUK BERDASARKAN BARCODE (GET)
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { barcode } = params;

    if (!barcode) {
      return NextResponse.json({ message: "Barcode tidak boleh kosong!" }, { status: 400 });
    }

    const product = await Product.findOne({ barcodeId: barcode });

    if (!product) {
      return NextResponse.json({ message: "Produk tidak ditemukan!" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengambil produk", error: error.message },
      { status: 500 }
    );
  }
}
