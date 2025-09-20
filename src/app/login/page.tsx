// Import AuthClient for client-side logic
import AuthClient from '@/components/AuthClient';

// Define metadata for SEO
export const metadata = {
  title: "Login / Signup | My Store",
  description: "Log in or sign up to access your account and start shopping.",
};

// Auth page component (Server Component)
export default function AuthPage() {
  return <AuthClient />;
}