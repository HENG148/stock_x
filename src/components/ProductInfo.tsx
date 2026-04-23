import ProductActions from "./ProductAction";
import SizeSelector from "./SizeSelector";

export default function ProductInfo({ product }: any) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        {product.name}
      </h1>
      <p className="text-gray-500 mb-4">
        {product.brand}
      </p>
      <SizeSelector />
      <ProductActions product={product} />
    </div>
  );
}