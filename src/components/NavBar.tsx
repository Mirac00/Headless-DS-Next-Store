'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { myStoreHook } from '@/context/MyStoreContext';
import '@/css/NavBar.css';

const NavBar = () => {
  const { cart, isAuthenticated, setUserLogout } = myStoreHook();
  const [click, setClick] = useState(false);
  const router = useRouter();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const handleLogout = () => {
    closeMobileMenu();
    setUserLogout();
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-box">
        <Link href="/" className="logo-container" onClick={closeMobileMenu}>
          <span className="navbar-brand">My Store</span>
        </Link>
        <div className="nav-filler"></div>
        <div className={`menu-icon ${click ? 'active' : ''}`} onClick={handleClick}>
          {click ? (
            <i className="fas fa-times"></i>
          ) : (
            <i className="fas fa-bars"></i>
          )}
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link className="nav-link" href="/" onClick={closeMobileMenu}>Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/products" onClick={closeMobileMenu}>Products</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/cart" onClick={closeMobileMenu}>
              Cart <span className="badge pill bg-secondary">{cart.length}</span>
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link href="/my-account" className="nav-link" onClick={closeMobileMenu}>My Account</Link>
              </li>
              <li className="nav-item">
                <Link href="/my-orders" className="nav-link" onClick={closeMobileMenu}>My Orders</Link>
              </li>
              <li className="nav-item">
                <Link href="/" className="nav-link" onClick={handleLogout}>Logout</Link>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link href="/login" className="nav-link" onClick={closeMobileMenu}>Login/Signup</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;