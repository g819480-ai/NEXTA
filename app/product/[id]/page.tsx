"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "../../../lib/store";
import { supabase } from "../../../lib/supabase";

export default function ProductPage() {
  const params = useParams();
  const id = String(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, price, category, description, badge, image_url"
        )
        .eq("id", id)
        .eq("active", true)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("Product loading error:", error);
        setProduct(null);
      } else {
        setProduct(data as Product | null);
      }

      setLoading(false);
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const addToCart = () => {
    if (!product) return;

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

  if (loading) {
    return (
      <div className="page">
        <div className="empty-state">
          <h1>Loading product...</h1>
        </div>
      </div>
    );
  }

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

  return (
    <div className="page">
      <Link href="/shop" className="back-link">
        ← Back to shop
      </Link>

      <div className="product-detail">
        <div className="product-detail-image">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "12px",
              }}
            />
          ) : (
            <div className="product-placeholder large">
              {product.name}
            </div>
          )}
        </div>

        <div className="product-info">
          <span className="eyebrow">{product.category}</span>

          <h1>{product.name}</h1>

          <div className="product-price">
            ₵{Number(product.price).toLocaleString()}
          </div>

          <p className="product-description">
            {product.description || "No description available."}
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

          <button
            onClick={addToCart}
            className="btn btn-primary add-cart"
          >
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
