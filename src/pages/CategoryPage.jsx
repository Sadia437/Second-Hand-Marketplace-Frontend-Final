import { useParams } from "react-router-dom"

export default function CategoryPage() {
  const { id } = useParams()

  const demoProducts = [
    { name: "iPhone X", price: 25000, location: "Dhaka" },
    { name: "Samsung A30", price: 12000, location: "Rajshahi" },
    { name: "Realme 8", price: 15000, location: "Chittagong" },
  ]

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Category ID: {id}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demoProducts.map((p, i) => (
          <div key={i} className="card bg-base-100 shadow-lg p-4">
            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p>Price: {p.price} BDT</p>
            <p>Location: {p.location}</p>
            <button className="btn btn-success btn-sm mt-2">View</button>
          </div>
        ))}
      </div>

    </div>
  )
}
