import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

// CARI PRODUK BERDASARKAN BARCODE (GET)
export async function GET(req, context) {
  try {
    await dbConnect();
    const { barcode } = await context.params;

    if (!barcode) {
      return NextResponse.json({ message: "Barcode tidak boleh kosong!" }, { status: 400 });
    }

    // Cari produk berdasarkan barcode dalam array barcodeIds
    const product = await Product.findOne({ barcodeIds: barcode });

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
