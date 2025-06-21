import { Product } from "../types"

interface Props {
  products: Product[]
  isAdmin: boolean
  onEdit?: (product: Product) => void
  onDelete?: (id: string) => void
}

export default function ProductTable({ products, isAdmin, onEdit, onDelete }: Props) {
  return (
    <table className="w-full mt-4 border">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2">Nama Produk</th>
          <th className="p-2">Harga Satuan</th>
          <th className="p-2">Quantity</th>
          {isAdmin && <th className="p-2">Aksi</th>}
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.id} className="text-center border-t">
            <td>{p.nama_produk}</td>
            <td>{p.harga_satuan}</td>
            <td>{p.quantity}</td>
            {isAdmin && (
              <td>
                <button onClick={() => onEdit?.(p)} className="text-blue-500 mr-2">Edit</button>
                <button onClick={() => onDelete?.(p.id)} className="text-red-500">Delete</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

