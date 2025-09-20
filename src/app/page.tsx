// Define metadata for SEO
export const metadata = {
  title: 'Home | My Store',
  description: 'Welcome to our clothing store! Browse products and enjoy shopping.',
};

// Import HomeClient for client-side logic
import HomeClient from '@/components/HomeClient';

// Home page component (Server Component)
export default function HomePage() {
  return <HomeClient />;
}