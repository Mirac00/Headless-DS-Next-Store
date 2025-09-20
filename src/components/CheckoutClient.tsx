'use client';

// Import React hooks
import { useState } from "react";
// Import Next.js useRouter for navigation
import { useRouter } from "next/navigation";
// Import API functions
import { createAnOrder } from "@/services/api";
// Import toast for notifications
import { toast } from "react-toastify";
// Import context hook
import { myStoreHook } from "@/context/MyStoreContext";
// Import types
import { User } from "@/types";

export default function CheckoutClient() {
  // Access context state and functions
  const { clearCart, loggedInUserData } = myStoreHook();
  // Router instance for navigation
  const router = useRouter();

  // State for checkout form
  const [checkoutData, setCheckoutData] = useState({
    customer_id: String(loggedInUserData?.id || ""),
    payment_method: "cod",
    payment_method_title: "Cash on Delivery",
    set_paid: false,
    billing: {
      first_name: "",
      last_name: "",
      address_1: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
      email: loggedInUserData?.email || "",
      phone: "",
    },
  });

  // Handle form input changes
  const handleOnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCheckoutData((prevFormData) => ({
      ...prevFormData,
      billing: {
        ...prevFormData.billing,
        [name]: value,
      },
    }));
  };

  // Handle checkout form submission
  const handleCheckoutSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await createAnOrder(checkoutData);
      if (!response) throw new Error("Failed to place order");

      toast.success("Order has been placed");
      clearCart();
      router.push("/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Checkout</h1>
      <form onSubmit={handleCheckoutSubmit}>
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <label htmlFor="first_name" className="form-label">
              First Name:
            </label>
            <input
              type="text"
              className="form-control"
              name="first_name"
              onChange={handleOnChangeInput}
              value={checkoutData.billing.first_name}
            />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="last_name" className="form-label">
              Last Name:
            </label>
            <input
              type="text"
              className="form-control"
              name="last_name"
              onChange={handleOnChangeInput}
              value={checkoutData.billing.last_name}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <label htmlFor="address_1" className="form-label">
              Address:
            </label>
            <input
              type="text"
              className="form-control"
              name="address_1"
              onChange={handleOnChangeInput}
              value={checkoutData.billing.address_1}
            />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="city" className="form-label">
              City:
            </label>
            <input
              type="text"
              className="form-control"
              name="city"
              onChange={handleOnChangeInput}
              value={checkoutData.billing.city}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <label htmlFor="state" className="form-label">
              State:
            </label>
            <input
              type="text"
              className="form-control"
              name="state"
              onChange={handleOnChangeInput}
              value={checkoutData.billing.state}
            />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="postcode" className="form-label">
              Postcode:
            </label>
            <input
              type="text"
              className="form-control"
              name="postcode"
              onChange={handleOnChangeInput}
              value={checkoutData.billing.postcode}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <label htmlFor="country" className="form-label">
              Country:
            </label>
            <input
              type="text"
              className="form-control"
              name="country"
              onChange={handleOnChangeInput}
              value={checkoutData.billing.country}
            />
          </div>
          <div className="col-12 col-md-6">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              onChange={handleOnChangeInput}
              value={checkoutData.billing.email}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <label htmlFor="phone" className="form-label">
              Phone:
            </label>
            <input
              type="text"
              className="form-control"
              name="phone"
              onChange={handleOnChangeInput}
              value={checkoutData.billing.phone}
            />
          </div>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}