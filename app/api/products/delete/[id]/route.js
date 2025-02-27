import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function DELETE(request, context) {
  try {
    await dbConnect();

    const { id } = await context.params;
    if (!id) return NextResponse.json({ success: false, message: "ID produk diperlukan!" }, { status: 400 });

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: "Produk tidak ditemukan!" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Produk berhasil dihapus!" });
  } catch (error) {
    console.error("Gagal menghapus produk:", error.message);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan!" }, { status: 500 });
  }
}
