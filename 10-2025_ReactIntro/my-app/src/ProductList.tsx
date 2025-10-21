    import type{ Product } from './types'; // Import our Product interface
    import './ProductList.css'; // Import the CSS file
    import ProductComponent from './Product'; // Import the Product component

    function ProductList() {
      // Define an array of products, explicitly typed as Product[]
      const products: Product[] = [
        { id: 101, name: 'Laptop', price: 1200 },
        { id: 102, name: 'Mouse', price: 25 },
        { id: 103, name: 'Keyboard', price: 75 },
        { id: 104, name: 'Monitor', price: 300 },
      ];

      return (
        <div className="product-list">
          <h2>Product List (Typed)</h2>
          <ul className="product-list-items">
            {/* Use map() to iterate over the 'products' array */}
            {products.map(product => (
              // IMPORTANT: Each list item MUST have a unique 'key' prop.
              // We use 'product.id' because it's a stable and unique identifier.
              <ProductComponent product={product} />
            ))}
          </ul>
          <p className="product-list-note">
            Each item in this list is rendered from an array using `map()`, and each has a unique `key` prop.
          </p>
        </div>
      );
    }

    export default ProductList;