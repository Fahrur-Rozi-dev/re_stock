import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function POST(req) {
  try {
    await dbConnect();
    const { barcodeId, qty } = await req.json();

    // Validasi input
    if (!barcodeId || !qty || qty <= 0) {
      return NextResponse.json({ message: "Data tidak valid!" }, { status: 400 });
    }

    // Cari produk berdasarkan barcode
    const product = await Product.findOne({ barcodeIds: barcodeId });

    if (!product) {
      return NextResponse.json({ message: "Produk tidak ditemukan!" }, { status: 404 });
    }

    // Pastikan stok mencukupi
    if (product.qty < qty) {
      return NextResponse.json({ message: "Stok tidak mencukupi!" }, { status: 400 });
    }

    // Hitung realized_profit
    const realizedProfit = (product.sell_price - product.avg_harga_beli) * qty;

    // Perbarui produk
    product.qty -= qty;
    product.realized_profit = (product.realized_profit || 0) + realizedProfit;
    product.total_profit = product.profit * product.qty; // Update total profit berdasarkan stok tersisa

    await product.save();

    return NextResponse.json(
      { message: "Penjualan berhasil!", product },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal memproses penjualan!", error: error.message },
      { status: 500 }
    );
  }
}
