'use client';

// Import React hooks
import { useEffect, useState } from "react";
// Import Next.js useRouter and useParams for navigation
import { useRouter, useParams } from "next/navigation";
// Import API functions
import { getSingleProductData } from "@/services/api";
// Import context hook
import { myStoreHook } from "@/context/MyStoreContext";
// Import types
import { Product } from "@/types";

export default function SingleProductClient() {
  // Access context functions
  const { addProductsToCart, setPageLoading, renderProductPrice } = myStoreHook();
  // State for product data
  const [product, setProduct] = useState<Product | null>(null);
  // Router instance for navigation
  const router = useRouter();
  // Get product ID from URL params
  const { id } = useParams();

  // Fetch product data by ID
  const getProductData = async (productId: number) => {
    setPageLoading(true);
    try {
      const response = await getSingleProductData(productId);
      setProduct(response || null);
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getProductData(Number(id));
    }
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="my-4">{product.name}</h1>
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.images?.[0]?.src}
            className="img-fluid"
            alt={product.name}
          />
        </div>
        <div className="col-md-6">
          <h3>{product.name}</h3>
          <p dangerouslySetInnerHTML={{ __html: product.description }}></p>
          <p>{renderProductPrice(product)}</p>
          <p>
            {product.categories?.map((category: { name: string }) => (
              <span key={category.name} className="badge bg-secondary me-1">
                {category.name}
              </span>
            ))}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => addProductsToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}