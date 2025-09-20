// Import SingleProductClient for client-side logic
import SingleProductClient from '@/components/SingleProductClient';

// Define metadata for SEO
export const metadata = {
  title: "Product Details | My Store",
  description: "View details of a specific product.",
};

// Single Product page component (Server Component)
export default function SingleProductPage() {
  return <SingleProductClient />;
}