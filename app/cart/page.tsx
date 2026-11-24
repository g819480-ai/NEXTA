"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("nesta-cart") || "[]"
    );

    setCart(saved);
  }, []);

  const updateCart = (items: CartItem[]) => {
    setCart(items);
    localStorage.setItem("nesta-cart", JSON.stringify(items));
  };

  const removeItem = (id: string) => {
    updateCart(cart.filter((item) => item.id !== id));
  };

  const changeQuantity = (id: string, amount: number) => {
    const updated = cart.map((item) => {
      if (item.id !== id) return item;

      return {
        ...item,
        quantity: Math.max(1, item.quantity + amount),
      };
    });

    updateCart(updated);
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="page">
      <div className="page-title">
        <span className="eyebrow">YOUR BAG</span>
        <h1>Shopping Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Find something you love and add it to your cart.</p>

          <Link href="/shop" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-product-image">
                  {item.name}
                </div>

                <div className="cart-product-info">
                  <h3>{item.name}</h3>

                  <p>
                    ₵{item.price.toLocaleString()}
                  </p>

                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        changeQuantity(item.id, -1)
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        changeQuantity(item.id, 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>

                <strong>
                  ₵{(item.price * item.quantity).toLocaleString()}
                </strong>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₵{subtotal.toLocaleString()}</strong>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>₵{subtotal.toLocaleString()}</strong>
            </div>

            <button className="btn btn-primary checkout-btn">
              Checkout
            </button>

            <Link href="/shop" className="continue-shopping">
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
