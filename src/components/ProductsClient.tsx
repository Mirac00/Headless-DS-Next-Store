'use client';

// Import React hooks
import { useEffect, useState } from "react";
// Import Next.js useRouter for navigation
import { useRouter } from "next/navigation";
// Import API functions
import { getAllProducts } from "@/services/api";
// Import context hook
import { myStoreHook } from "@/context/MyStoreContext";
// Import types
import { Product } from "@/types";

export default function ProductsClient() {
  // Access context functions
  const { addProductsToCart, setPageLoading, renderProductPrice } = myStoreHook();
  // State for products
  const [products, setProducts] = useState<Product[]>([]);
  // Router instance for navigation
  const router = useRouter();

  // Fetch all products on mount
  const getAllProductsData = async () => {
    setPageLoading(true);
    try {
      const response = await getAllProducts();
      setProducts(response || []);
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getAllProductsData();
  }, []);

  // Navigate to single product page
  const handleSingleProductDetailsRedirection = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className="container">
      <h1 className="my-4">Products</h1>
      <div className="row">
        {products.map((singleProduct: Product) => (
          <div
            key={singleProduct.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
          >
            <div className="card product-card">
              <img
                className="card-img-top"
                src={singleProduct?.images?.[0]?.src}
                alt={singleProduct.name}
              />
              <div className="card-body">
                <h5
                  className="card-title"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSingleProductDetailsRedirection(singleProduct.id)}
                >
                  {singleProduct.name}
                </h5>
                <p className="card-text">{renderProductPrice(singleProduct)}</p>
                <p
                  className="card-text"
                  dangerouslySetInnerHTML={{ __html: singleProduct?.description }}
                ></p>
                <p className="card-text">
                  Category:{" "}
                  {singleProduct?.categories?.map((category) => category.name).join(", ")}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => addProductsToCart(singleProduct)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}