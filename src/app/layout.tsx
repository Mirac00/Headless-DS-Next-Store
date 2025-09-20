import { MyStoreProvider } from '@/context/MyStoreContext';
import './globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientLayout from '@/components/ClientLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/styles.css';

export const metadata = {
  title: 'My Store',
  description: 'Headless WooCommerce store built with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MyStoreProvider>
          <ClientLayout>
            <NavBar />
            <main className="container mx-auto px-4">
              <ToastContainer />
              {children}
            </main>
            <Footer />
          </ClientLayout>
        </MyStoreProvider>
      </body>
    </html>
  );
}