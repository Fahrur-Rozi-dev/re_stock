"use client";
import { useParams } from "next/navigation"; 
import { useRouter } from "next/navigation";

const DeleteProduct = () => {
const params = useParams();
  const router = useRouter();
  const { id } = params;

  const handleDelete = async () => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

    if (res.ok) {
      alert("Produk berhasil dihapus!");
      router.push("/products");
    } else {
      alert("Gagal menghapus produk");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl font-bold mb-4">Apakah Anda yakin ingin menghapus produk ini?</h1>
      <div className="flex gap-4">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Ya, Hapus
        </button>
        <button
          onClick={() => router.push("/products")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Batal
        </button>
      </div>
    </div>
  );
};

export default DeleteProduct;
