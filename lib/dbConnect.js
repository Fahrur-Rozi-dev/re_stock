let isConnected = false;

const dbConnect = async () => {
  if (isConnected) {
    console.log("🔄 Menggunakan koneksi database yang sudah ada.");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ Gagal koneksi ke database:", error);
    throw new Error("Database connection failed");
  }
};

export default dbConnect;