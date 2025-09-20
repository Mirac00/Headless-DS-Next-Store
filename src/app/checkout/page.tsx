// Import CheckoutClient for client-side logic
import CheckoutClient from '@/components/CheckoutClient';

// Define metadata for SEO
export const metadata = {
  title: "Checkout | My Store",
  description: "Complete your order by providing billing and payment details.",
};

// Checkout page component (Server Component)
export default function CheckoutPage() {
  return <CheckoutClient />;
}