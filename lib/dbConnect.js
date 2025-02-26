import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI belum diatur dalam environment variables!");
}

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    throw new Error("Gagal koneksi ke database");
  }
};

export default dbConnect;
