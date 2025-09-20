'use client';

// Import React hooks
import { useEffect, useState } from "react";
// Import Next.js useRouter for navigation
import { useRouter } from "next/navigation";
// Import context hook
import { myStoreHook } from "@/context/MyStoreContext";
// Import types
import { Product } from "@/types";

export default function CartClient() {
  // Access context state and functions
  const { cart, removeFromCart, isAuthenticated } = myStoreHook();
  // State for cart items
  const [cartItems, setCartItems] = useState<Product[]>(cart);
  // Router instance for navigation
  const router = useRouter();

  // Update cart items when context cart changes
  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  // Navigate to checkout or login page
  const goToCheckoutPage = () => {
    if (isAuthenticated) {
      router.push("/checkout");
    } else {
      router.push("/login");
    }
  };

  // Render product price
  const renderProductPrice = (product: Product) => {
    if (product.sale_price) {
      return (
        <>
          <span className="text-muted text-decoration-line-through">
            ${product.regular_price}
          </span>
          <span className="text-danger"> ${product.sale_price}</span>
        </>
      );
    }
    return <>${product.regular_price || product.price || "0"}</>;
  };

  // Calculate total price
  const calculateTotalItemsPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const price = item.sale_price || item.regular_price || item.price || "0";
        return total + parseFloat(String(price)) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <div className="container">
      <h1 className="my-4">Cart</h1>
      <div id="cart-items">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((singleProduct, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={singleProduct?.images?.[0]?.src}
                    alt={singleProduct.name}
                    style={{ width: "50px" }}
                  />
                </td>
                <td>{singleProduct.name}</td>
                <td>{renderProductPrice(singleProduct)}</td>
                <td>{singleProduct.quantity}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeFromCart(singleProduct)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="row align-items-center">
          <div className="col">
            <h3>Total: ${calculateTotalItemsPrice()}</h3>
          </div>
          <div className="col text-end">
            <button className="btn btn-success" onClick={goToCheckoutPage}>
              Checkout
            </button>
          </div>
        </div>
      </div>
      <div id="empty-cart-message">
        {cartItems.length > 0 ? "" : <p>Your cart is empty.</p>}
      </div>
    </div>
  );
}