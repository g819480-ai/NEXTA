"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(
        localStorage.getItem("nesta-cart") || "[]"
      );

      const count = cart.reduce(
        (total: number, item: { quantity: number }) =>
          total + item.quantity,
        0
      );

      setCartCount(count);
    };

    updateCartCount();

    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">
          NESTA
        </Link>

        <nav className="desktop-nav">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="header-actions">
          <Link href="/shop" aria-label="Search">
            <Search size={20} />
          </Link>

          <Link href="/wishlist" aria-label="Wishlist">
            <Heart size={20} />
          </Link>

          <Link href="/account" aria-label="Account">
            <User size={20} />
          </Link>

          <Link href="/cart" className="cart-icon">
            <ShoppingBag size={21} />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link href="/shop" onClick={() => setMenuOpen(false)}>
            Shop
          </Link>

          <Link href="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>

          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>

          <Link href="/account" onClick={() => setMenuOpen(false)}>
            Account
          </Link>

          <Link href="/wishlist" onClick={() => setMenuOpen(false)}>
            Wishlist
          </Link>

          <Link href="/cart" onClick={() => setMenuOpen(false)}>
            Cart
          </Link>
        </div>
      )}
    </header>
  );
}
