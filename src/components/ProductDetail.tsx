import ExpandableDescription from "@/src/components/EnableDescription";

export default function ProductDetails({ product }: any) {
  return (
    <div className="mt-12 pt-10 border-t">
      <h2 className="text-lg font-bold mb-6">Product Details</h2>

      <div className="flex gap-20">
        <div>
          <p>Brand: {product.brand}</p>
          <p>Category: {product.category}</p>
          <p>SKU: {product.sku}</p>
        </div>

        <div>
          <p className="font-semibold mb-2">Description</p>

          {product.description ? (
            <ExpandableDescription description={product.description} />
          ) : (
            <p>No description</p>
          )}
        </div>
      </div>
    </div>
  );
}