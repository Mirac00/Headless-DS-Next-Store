'use client';

import { myStoreHook } from '@/context/MyStoreContext';
import Loader from './Loader';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { pageLoading } = myStoreHook();

  return (
    <>
      {pageLoading && <Loader />}
      {children}
    </>
  );
}