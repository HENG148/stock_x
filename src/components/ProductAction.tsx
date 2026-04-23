export default function ProductActions({ product }: any) {
  return (
    <div className="border p-5 rounded-xl">
      <p className="text-3xl font-bold mb-4">
        ${Number(product.price).toLocaleString()}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button className="border py-3 rounded-full">
          Make Offer
        </button>

        <button className="bg-green-600 text-white py-3 rounded-full">
          Buy Now
        </button>
      </div>
    </div>
  );
}