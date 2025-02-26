import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

// AMBIL DATA PRODUK BERDASARKAN ID (GET)
export async function GET(req,context ) {
  try {
    await dbConnect();
    const { id } = await context.params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal mengambil produk", error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE PRODUK (PUT)
export async function PUT(req, context) {
  try {
    await dbConnect();
    const { id } = await context.params;

    const body = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal update produk", error: error.message },
      { status: 500 }
    );
  }
}

// HAPUS PRODUK (DELETE)
export async function DELETE(req, context) {
  try {
    await dbConnect();
    const { id } = await context.params;

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Produk berhasil dihapus" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal hapus produk", error: error.message },
      { status: 500 }
    );
  }
}
