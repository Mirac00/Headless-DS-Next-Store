// Import CartClient for client-side logic
import CartClient from '@/components/CartClient';

// Define metadata for SEO
export const metadata = {
  title: "Cart | My Store",
  description: "View and manage items in your shopping cart.",
};

// Cart page component (Server Component)
export default function CartPage() {
  return <CartClient />;
}