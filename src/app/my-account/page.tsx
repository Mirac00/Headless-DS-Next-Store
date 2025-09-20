// Import MyAccountClient for client-side logic
import MyAccountClient from '@/components/MyAccountClient';

// Define metadata for SEO
export const metadata = {
  title: "My Account | My Store",
  description: "View and manage your account information.",
};

// MyAccount page component (Server Component)
export default function MyAccountPage() {
  return <MyAccountClient />;
}