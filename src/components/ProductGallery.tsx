import Image from "next/image";

export default function ProductGallery({ product }: any) {
  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden aspect-square mb-4 border border-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-10"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-8xl">
            👟
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <div className="w-20 h-20 rounded-xl border-2 border-gray-900 flex items-center justify-center">
          360°
        </div>
        {product.imageUrl && (
          <div className="w-20 h-20 rounded-xl border border-gray-200 relative overflow-hidden">
            <Image src={product.imageUrl} alt={product.name} fill />
          </div>
        )}
      </div>
    </div>
  );
}