import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function GET() {
  try {
    await dbConnect();

    // Ambil semua produk
    const products = await Product.find();

    // Hitung total produk
    const totalProducts = products.length;

    // Hitung total stok (jumlah semua qty produk)
    const totalStock = products.reduce((sum, product) => sum + product.qty, 0);

    // Hitung total nilai stok berdasarkan harga jual
    const totalValue = products.reduce(
      (sum, product) => sum + product.sell_price * product.qty,
      0
    );

    // Hitung unrealized profit (keuntungan potensial jika semua produk terjual)
    const unrealizedProfit = products.reduce(
      (sum, product) => sum + (product.sell_price - product.buy_price) * product.qty,
      0
    );

    // Hitung realized profit (keuntungan yang sudah didapat)
    const realizedProfit = products.reduce(
      (sum, product) => sum + (product.realized_profit || 0),
      0
    );

    // Cari produk dengan stok 0 atau hampir habis (misalnya <= 5)
    const lowStockProducts = products.filter((product) => product.qty <= 5);

    // Cari produk dengan stok terbanyak (pastikan array tidak kosong)
    const highStockProduct =
      products.length > 0
        ? products.reduce((max, product) => (product.qty > max.qty ? product : max))
        : null;

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalStock,
        totalValue,
        unrealizedProfit,
        realizedProfit,
        lowStockProducts,
        highStockProduct,
      },
    });
  } catch (error) {
    console.error("Error di API Dashboard:", error.message);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan!", error: error.message },
      { status: 500 }
    );
  }
}
