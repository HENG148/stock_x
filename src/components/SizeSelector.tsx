import { SIZES } from "@/src/types/type";

export default function SizeSelector() {
  return (
    <div className="mb-5">
      <p className="text-sm font-semibold mb-2">Size</p>

      <div className="grid grid-cols-6 gap-2">
        {SIZES.map((size) => (
          <button
            key={size}
            className="py-2 border rounded-lg hover:bg-black hover:text-white"
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}