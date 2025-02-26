import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  barcodeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  details: { type: String }
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
