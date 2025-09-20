// Import ProductsClient for client-side logic
import ProductsClient from '@/components/ProductsClient';

// Define metadata for SEO
export const metadata = {
  title: "Products | My Store",
  description: "Browse our collection of products.",
};

// Products page component (Server Component)
export default function ProductsPage() {
  return <ProductsClient />;
}