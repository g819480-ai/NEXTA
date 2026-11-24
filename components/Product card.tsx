"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "../lib/store";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const addToCart = () => {
    const existing = JSON.parse(
      localStorage.getItem("nesta-cart") || "[]"
    );

    const found = existing.find(
      (item: Product & { quantity: number }) =>
        item.id === product.id
    );

    if (found) {
      found.quantity += 1;
    } else {
      existing.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "nesta-cart",
      JSON.stringify(existing)
    );

    window.dispatchEvent(new Event("storage"));
  };

  return (
    <article className="product-card">
      <Link href={`/product/${product.id}`}>
        <div className="product-image">
          <div className="product-placeholder">
            {product.name}
          </div>

          {product.badge && (
            <span className="product-badge">
              {product.badge}
            </span>
          )}
        </div>
      </Link>

      <div className="product-card-body">
        <div className="product-card-top">
          <div>
            <span className="product-category">
              {product.category}
            </span>

            <Link href={`/product/${product.id}`}>
              <h3>{product.name}</h3>
            </Link>
          </div>

          <button
            className="wishlist-button"
            aria-label="Add to wishlist"
          >
            <Heart size={18} />
          </button>
        </div>

        <div className="product-card-bottom">
          <strong>
            ₵{product.price.toLocaleString()}
          </strong>

          <button
            className="add-button"
            onClick={addToCart}
            aria-label="Add to cart"
          >
            <ShoppingBag size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
