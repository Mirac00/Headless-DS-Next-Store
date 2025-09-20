'use client';

// Import Next.js useRouter for navigation
import { useRouter } from "next/navigation";
// Import mall image
import mallImage from "../../public/mall.jpg";

export default function HomeClient() {
  // Router instance for navigation
  const router = useRouter();

  // Navigate to products page
  const handleProductPageRedirection = () => {
    router.push("/products");
  };

  return (
    <>
      <div className="hero-banner">
        <img src={mallImage.src} alt="Hero Banner" className="img-fluid" />
        <div className="hero-text text-center" style={{ marginTop: "30px" }}>
          <h1>Welcome to Our Clothing Store</h1>
          <p>Browse our products and enjoy shopping!</p>
          <button className="btn btn-primary" onClick={handleProductPageRedirection}>
            Shop Now
          </button>
        </div>
      </div>
      <div className="container mt-5">
        <h2 className="text-center mb-4">What Our Customers Say</h2>
        <div className="row">
          <div className="col-sm-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <p className="card-text">
                  "This is a testimonial from a happy customer. They love our products and our service!"
                </p>
                <div className="card-footer text-muted">- Customer 1</div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <p className="card-text">
                  "This is a testimonial from a happy customer. They love our products and our service!"
                </p>
                <div className="card-footer text-muted">- Customer 2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}