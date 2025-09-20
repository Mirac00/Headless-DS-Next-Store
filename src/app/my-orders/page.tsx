// Import MyOrdersClient for client-side logic
import MyOrdersClient from '@/components/MyOrdersClient';

// Define metadata for SEO
export const metadata = {
  title: "My Orders | My Store",
  description: "View your order history.",
};

// MyOrders page component (Server Component)
export default function MyOrdersPage() {
  return <MyOrdersClient />;
}