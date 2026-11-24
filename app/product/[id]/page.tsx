"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { products } from "../../../lib/store";

export default function ProductPage() {
  const params = useParams();
  const id = String(params.id);

  const product = products.find((item) => item.id === id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="page">
        <div className="empty-state">
          <h1>Product not found</h1>
          <Link href="/shop" className="btn btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const addToCart = () => {
    const existing = JSON.parse(
      localStorage.getItem("nesta-cart") || "[]"
    );

    const found = existing.find(
      (item: { id: string }) => item.id === product.id
    );

    if (found) {
      found.quantity += quantity;
    } else {
      existing.push({
        ...product,
        quantity,
      });
    }

    localStorage.setItem("nesta-cart", JSON.stringify(existing));
    setAdded(true);
  };

  return (
    <div className="page">
      <Link href="/shop" className="back-link">
        ← Back to shop
      </Link>

      <div className="product-detail">
        <div className="product-detail-image">
          <div className="product-placeholder large">
            {product.name}
          </div>
        </div>

        <div className="product-info">
          <span className="eyebrow">{product.category}</span>

          <h1>{product.name}</h1>

          <div className="product-price">
            ₵{product.price.toLocaleString()}
          </div>

          <p className="product-description">
            {product.description}
          </p>

          <div className="quantity-control">
            <button
              onClick={() =>
                setQuantity((value) => Math.max(1, value - 1))
              }
            >
              −
            </button>

            <span>{quantity}</span>

            <button onClick={() => setQuantity((value) => value + 1)}>
              +
            </button>
          </div>

          <button onClick={addToCart} className="btn btn-primary add-cart">
            {added ? "Added to Cart ✓" : "Add to Cart"}
          </button>

          {added && (
            <Link href="/cart" className="cart-link">
              Go to cart →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
