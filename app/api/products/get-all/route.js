import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function GET() {
  try {
    await dbConnect();

    const products = await Product.find();

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data produk!" },
      { status: 500 }
    );
  }
}
