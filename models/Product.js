import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  barcodeIds: { type: [String], required: true }, // Array untuk menyimpan banyak barcode
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  details: { type: String }
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
