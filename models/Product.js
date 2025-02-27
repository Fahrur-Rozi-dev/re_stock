import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  barcodeIds: { type: [String], required: true },
  name: { type: String, required: true },
  sell_price: { type: Number, required: true },
  buy_price: { type: Number, required: true },
  avg_harga_beli: { type: Number, required: true },
  profit: { type: Number, required: true },
  total_profit: { type: Number, required: true },
  realized_profit: { type: Number, required: false },
  qty: { type: Number, required: true },
  details: { type: String }
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
