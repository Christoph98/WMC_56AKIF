import type { Product } from "./types";

function ProductComponent({ product }: { product: Product }) {
  return (
     <li key={product.id} className="product-item">
                <span>{product.name}</span>
                <span className="product-price">${product.price.toFixed(2)}</span>
                </li>
  );
}
export default ProductComponent;