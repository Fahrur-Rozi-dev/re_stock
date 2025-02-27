import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function GET(req, context) {
  try {
    await dbConnect();
    const { id } = context.params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil produk", error: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    await dbConnect();
    const { id } = context.params;
    const body = await req.json();

    const updatedData = {
      ...body,
      profit: body.sell_price - body.buy_price,
      total_profit: (body.sell_price - body.buy_price) * body.qty,
      avg_harga_beli: body.buy_price,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedProduct) {
      return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Gagal update produk", error: error.message }, { status: 500 });
  }
}
