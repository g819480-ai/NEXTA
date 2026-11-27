"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  image?: string;
}
export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nesta-cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (error) {
      console.error("Could not load cart:", error);
      setCart([]);
    }
    setLoaded(true);
  }, []);
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      return (
        total +
        Number(item.price || 0) *
          Number(item.quantity || 1)
      );
    }, 0);
  }, [cart]);
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;
  function formatPrice(value: number) {
    return `₵${value.toLocaleString("en-GH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  function updateQuantity(
    id: string,
    amount: number
  ) {
    const updated = cart
      .map((item) => {
        if (item.id !== id) {
          return item;
        }
        return {
          ...item,
          quantity: Math.max(
            1,
            Number(item.quantity || 1) +
              amount
          ),
        };
      })
      .filter(
        (item) =>
          Number(item.quantity) > 0
      );
    setCart(updated);
    localStorage.setItem(
      "nesta-cart",
      JSON.stringify(updated)
    );
  }
  function removeItem(id: string) {
    const updated = cart.filter(
      (item) => item.id !== id
    );
    setCart(updated);
    localStorage.setItem(
      "nesta-cart",
      JSON.stringify(updated)
    );
  }
  function placeOrder() {
    setError("");
    if (cart.length === 0) {
      setError(
        "There are no products in your cart."
      );
      return;
    }
    if (!name.trim()) {
      setError(
        "Please enter the receiver's full name."
      );
      return;
    }
    if (!phone.trim()) {
      setError(
        "Please enter the receiver's phone number."
      );
      return;
    }
    if (!address.trim()) {
      setError(
        "Please enter the delivery address."
      );
      return;
    }
    if (!city.trim()) {
      setError(
        "Please enter the city."
      );
      return;
    }
    if (!region.trim()) {
      setError(
        "Please enter the region."
      );
      return;
    }
    setSubmitting(true);
    const order = {
      id: `NESTA-${Date.now()}`,
      receiverName: name.trim(),
      receiverPhone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      region: region.trim(),
      items: cart,
      subtotal,
      delivery: deliveryFee,
      total,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(
      "nesta-order",
      JSON.stringify(order)
    );
    localStorage.removeItem(
      "nesta-cart"
    );
    window.location.href =
      "/order-success";
  }
  if (!loaded) {
    return (
      <main className="checkout-page">
        <div className="loading">
          Loading checkout...
        </div>
      </main>
    );
  }
  if (cart.length === 0) {
    return (
      <main className="checkout-page">
        <div className="empty">
          <h1>Your cart is empty</h1>
          <p>
            No products were found in your
            cart.
          </p>
          <Link href="/shop">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }
  return (
    <main className="checkout-page">
      <div className="container">
        <div className="header">
          <Link href="/cart">
            ← Back to Cart
          </Link>
          <h1>Checkout</h1>
          <p>
            Enter the receiver's details
            for delivery.
          </p>
        </div>
        <div className="checkout-grid">
          <section>
            <div className="card">
              <h2>
                Receiver Details
              </h2>
              <label>
                Full Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  placeholder="Receiver's full name"
                />
              </label>
              <label>
                Phone Number
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  placeholder="024 000 0000"
                />
              </label>
            </div>
            <div className="card">
              <h2>
                Delivery Address
              </h2>
              <label>
                Address
                <textarea
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  placeholder="House number, street, area..."
                  rows={4}
                />
              </label>
              <div className="row">
                <label>
                  City
                  <input
                    type="text"
                    value={city}
                    onChange={(e) =>
                      setCity(
                        e.target.value
                      )
                    }
                    placeholder="Accra"
                  />
                </label>
                <label>
                  Region
                  <input
                    type="text"
                    value={region}
                    onChange={(e) =>
                      setRegion(
                        e.target.value
                      )
                    }
                    placeholder="Greater Accra"
                  />
                </label>
              </div>
            </div>
            {error && (
              <div className="error">
                {error}
              </div>
            )}
            <button
              type="button"
              className="place-order"
              onClick={placeOrder}
              disabled={submitting}
            >
              {submitting
                ? "Processing..."
                : "Place Order"}
            </button>
          </section>
          <aside>
            <div className="card summary">
              <h2>
                Order Summary
              </h2>
              <div className="products">
                {cart.map((item) => {
                  const image =
                    item.image_url ||
                    item.image;
                  return (
                    <div
                      className="product"
                      key={item.id}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={item.name}
                        />
                      ) : (
                        <div className="image-placeholder">
                          NESTA
                        </div>
                      )}
                      <div className="product-info">
                        <h3>
                          {item.name}
                        </h3>
                        <p>
                          {formatPrice(
                            Number(
                              item.price
                            )
                          )}
                        </p>
                        <div className="quantity">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                -1
                              )
                            }
                          >
                            −
                          </button>
                          <span>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                1
                              )
                            }
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="remove"
                            onClick={() =>
                              removeItem(
                                item.id
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <strong>
                        {formatPrice(
                          Number(
                            item.price
                          ) *
                            Number(
                              item.quantity
                            )
                        )}
                      </strong>
                    </div>
                  );
                })}
              </div>
              <div className="line">
                <span>
                  Subtotal
                </span>
                <strong>
                  {formatPrice(
                    subtotal
                  )}
                </strong>
              </div>
              <div className="line">
                <span>
                  Delivery
                </span>
                <strong>
                  Free
                </strong>
              </div>
              <div className="total">
                <span>
                  Total
                </span>
                <strong>
                  {formatPrice(
                    total
                  )}
                </strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <style jsx>{`
        .checkout-page {
          min-height: 100vh;
          background: #f7f7f5;
          color: #111;
          padding: 40px 20px 80px;
        }
        .container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }
        .header {
          margin-bottom: 32px;
        }
        .header a {
          color: #111;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }
        .header h1 {
          margin: 20px 0 8px;
          font-size: clamp(
            38px,
            7vw,
            64px
          );
          line-height: 1;
          letter-spacing: -3px;
        }
        .header p {
          color: #666;
          margin: 0;
        }
        .checkout-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1.4fr)
            minmax(320px, 0.8fr);
          gap: 24px;
          align-items: start;
        }
        .card {
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 20px;
        }
        .card h2 {
          margin: 0 0 22px;
          font-size: 20px;
        }
        label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 18px;
        }
        input,
        textarea {
          display: block;
          width: 100%;
          box-sizing: border-box;
          margin-top: 8px;
          padding: 14px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: #fff;
          color: #111;
          font: inherit;
          outline: none;
        }
        input:focus,
        textarea:focus {
          border-color: #111;
        }
        textarea {
          resize: vertical;
        }
        .row {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 15px;
        }
        .error {
          background: #fff0f0;
          border: 1px solid #ffd0d0;
          color: #b00020;
          border-radius: 10px;
          padding: 13px 15px;
          margin-bottom: 15px;
          font-size: 14px;
        }
        .place-order {
          width: 100%;
          border: 0;
          border-radius: 12px;
          padding: 17px 20px;
          background: #111;
          color: #fff;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }
        .place-order:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .product {
          display: grid;
          grid-template-columns:
            65px 1fr auto;
          gap: 12px;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }
        .product img,
        .image-placeholder {
          width: 65px;
          height: 65px;
          border-radius: 10px;
          object-fit: cover;
          background: #f1f1f1;
        }
        .image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 900;
        }
        .product-info h3 {
          margin: 0 0 5px;
          font-size: 14px;
        }
        .product-info p {
          margin: 0 0 8px;
          color: #666;
          font-size: 13px;
        }
        .product > strong {
          white-space: nowrap;
          font-size: 13px;
        }
        .quantity {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .quantity button {
          min-width: 27px;
          height: 27px;
          border: 1px solid #ddd;
          border-radius: 7px;
          background: #fff;
          cursor: pointer;
        }
        .quantity span {
          min-width: 15px;
          text-align: center;
          font-size: 13px;
        }
        .quantity .remove {
          border: 0;
          color: #b00020;
          background: transparent;
          font-size: 11px;
          margin-left: 4px;
        }
        .line {
          display: flex;
          justify-content: space-between;
          padding-top: 18px;
          font-size: 14px;
          color: #666;
        }
        .line strong {
          color: #111;
        }
        .total {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 20px;
        }
        .empty,
        .loading {
          max-width: 600px;
          margin: 100px auto;
          padding: 45px 25px;
          background: #fff;
          border-radius: 18px;
          text-align: center;
        }
        .empty h1 {
          margin-top: 0;
        }
        .empty p {
          color: #666;
        }
        .empty a {
          display: inline-block;
          margin-top: 15px;
          padding: 13px 20px;
          background: #111;
          color: #fff;
          border-radius: 10px;
          text-decoration: none;
        }
        @media (max-width: 800px) {
          .checkout-page {
            padding: 25px 15px 60px;
          }
          .checkout-grid {
            grid-template-columns: 1fr;
          }
          .row {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .header h1 {
            font-size: 44px;
          }
        }
      `}</style>
    </main>
  );
}
