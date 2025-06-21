"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "../utils/auth";
import { supabase } from "../lib/supabase";

const IconPlus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const IconPencil = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
    />
  </svg>
);

const IconTrash = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  const [namaProduk, setNamaProduk] = useState("");
  const [hargaSatuan, setHargaSatuan] = useState("");

  const [quantity, setQuantity] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const currentUser = getSession();
    if (!currentUser) {
      router.push("/signin");
      return;
    }
    setUser(currentUser);
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select()
      .order("created_at", { ascending: false });
    setProducts(data || []);
  };

  const resetForm = () => {
    setEditingId(null);

    setNamaProduk("");
    setHargaSatuan("");
    setQuantity("");
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaProduk || !hargaSatuan || !quantity) return;

    const { error } = await supabase.from("products").insert([
      {
        nama_produk: namaProduk,
        harga_satuan: parseFloat(hargaSatuan),
        quantity: parseInt(quantity),
      },
    ]);

    if (!error) {
      resetForm();
      fetchProducts();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) {
        fetchProducts();
      }
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);

    setNamaProduk(product.nama_produk);
    setHargaSatuan(product.harga_satuan.toString());
    setQuantity(product.quantity.toString());
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingId || !namaProduk || !hargaSatuan || !quantity) return;

    const { error } = await supabase
      .from("products")
      .update({
        nama_produk: namaProduk,
        harga_satuan: parseFloat(hargaSatuan),
        quantity: parseInt(quantity),
      })
      .eq("id", editingId);

    if (!error) {
      resetForm();
      fetchProducts();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard Produk
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome, {user?.username}!
          </p>
        </header>

        {user?.role === "admin" && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">
              {editingId ? "Edit Produk" : "Tambah Produk Baru"}
            </h2>
            <form
              onSubmit={editingId ? handleUpdate : handleAddProduct}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Nama Produk"
                  value={namaProduk}
                  onChange={(e) => setNamaProduk(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
                <input
                  type="number"
                  placeholder="Harga"
                  value={hargaSatuan}
                  onChange={(e) => setHargaSatuan(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
                <input
                  type="number"
                  placeholder="Kuantitas"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="flex cursor-pointer items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-300 shadow"
                >
                  <IconPlus />
                  {editingId ? "Update Produk" : "Tambah Produk"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-slate-200 text-slate-700 px-6 py-3 rounded-md font-semibold hover:bg-slate-300 transition-colors duration-300"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            Daftar Produk ({products.length})
          </h2>

          <div className="hidden md:block">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold text-slate-600">
                    Nama Produk
                  </th>
                  <th className="p-4 font-semibold text-slate-600">Harga</th>
                  <th className="p-4 font-semibold text-slate-600">Qty</th>
                  {user?.role === "admin" && (
                    <th className="p-4 font-semibold text-slate-600 text-center">
                      Aksi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-200 hover:bg-slate-50"
                  >
                    <td className="p-4 text-slate-800">{p.nama_produk}</td>
                    <td className="p-4 text-slate-500">
                      Rp {p.harga_satuan.toLocaleString("id-ID")}
                    </td>
                    <td className="p-4 text-slate-500">{p.quantity}</td>
                    {user?.role === "admin" && (
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                          >
                            <IconPencil />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="block md:hidden space-y-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-slate-50 p-4 rounded-lg border border-slate-200"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-800 text-lg">
                    {p.nama_produk}
                  </h3>
                  {user?.role === "admin" && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"
                      >
                        <IconPencil />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-slate-600">
                  <p>
                    <span className="font-semibold">Harga:</span> Rp{" "}
                    {p.harga_satuan.toLocaleString("id-ID")}
                  </p>
                  <p>
                    <span className="font-semibold">Kuantitas:</span>{" "}
                    {p.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center p-8 text-slate-500">
              <p>Belum ada produk. Silakan tambahkan produk baru.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
