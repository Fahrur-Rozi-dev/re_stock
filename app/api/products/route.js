import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    let { barcodeId, name, sell_price, buy_price, qty, details } = body;

    qty = Number(qty);
    sell_price = Number(sell_price);
    buy_price = Number(buy_price);

    let existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      if (!existingProduct.barcodeIds.includes(barcodeId)) {
        existingProduct.barcodeIds.push(barcodeId);
      }

      const totalQty = existingProduct.qty + qty;
      const totalBuyPrice = existingProduct.avg_harga_beli * existingProduct.qty + buy_price * qty;
      const newAvgBuyPrice = totalBuyPrice / totalQty;

      existingProduct.qty = totalQty;
      existingProduct.sell_price = sell_price;
      existingProduct.buy_price = buy_price;
      existingProduct.avg_harga_beli = newAvgBuyPrice;
      existingProduct.profit = sell_price - newAvgBuyPrice;
      existingProduct.total_profit = existingProduct.profit * totalQty;
      existingProduct.details = details;

      await existingProduct.save();

      return NextResponse.json(
        { message: "Stok & barcode produk diperbarui!", data: existingProduct },
        { status: 200 }
      );
    }

    const newProduct = new Product({
      barcodeIds: [barcodeId],
      name,
      sell_price,
      buy_price,
      avg_harga_beli: buy_price,
      profit: sell_price - buy_price,
      total_profit: (sell_price - buy_price) * qty,
      qty,
      details,
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

//     // Ambil semua produk
//     const products = await Product.find({}, "name barcodeIds price qty details");

//     return NextResponse.json({ message: "Produk ditemukan", data: products }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Gagal mengambil produk", error: error.message },
//       { status: 500 }
//     );
//   }
// }


export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) return NextResponse.json({ product: null }, { status: 200 });

    const product = await Product.findOne({ name });

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Error fetching product", error }, { status: 500 });
  }
}


