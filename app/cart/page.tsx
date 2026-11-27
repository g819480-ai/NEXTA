"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nesta-cart");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch {
      setCart([]);
    }

    setLoaded(true);
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 1),
      0
    );
  }, [cart]);

  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  function formatPrice(value: number) {
    return `GH₵${value.toFixed(2)}`;
  }

  function updateCartQuantity(
    id: string,
    quantity: number
  ) {
    const updated = cart
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
      .filter(
        (item) => item.quantity > 0
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

  function submitOrder() {
    setError("");

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter the receiver's full name.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter the receiver's phone number.");
      return;
    }

    if (!address.trim()) {
      setError("Please enter the delivery address.");
      return;
    }

    if (!city.trim()) {
      setError("Please enter the city.");
      return;
    }

    if (!region.trim()) {
      setError("Please enter the region.");
      return;
    }

    setSubmitting(true);

    const orderLines = cart
      .map(
        (item) =>
          `${item.name} x${item.quantity} - ${formatPrice(
            Number(item.price) *
              Number(item.quantity)
          )}`
      )
      .join("\n");

    const order = {
      customerName: name.trim(),
      receiverPhone: phone.trim(),
      deliveryAddress: address.trim(),
      city: city.trim(),
      region: region.trim(),
      items: cart,
      subtotal,
      deliveryFee,
      total,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "nesta-last-order",
      JSON.stringify(order)
    );

    const message = [
      "NESTA ORDER",
      "",
      `Receiver: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Address: ${address.trim()}`,
      `City: ${city.trim()}`,
      `Region: ${region.trim()}`,
      "",
      "ORDER ITEMS:",
      orderLines,
      "",
      `Subtotal: ${formatPrice(subtotal)}`,
      `Delivery: ${formatPrice(deliveryFee)}`,
      `TOTAL: ${formatPrice(total)}`,
    ].join("\n");

    localStorage.removeItem("nesta-cart");
    setCart([]);

    /*
     * The customer's phone number is kept as the
     * receiver contact number.
     *
     * The order is also saved locally so the
     * checkout does not depend on a store
     * WhatsApp number.
     */

    const orderUrl =
      `/order-success?order=${encodeURIComponent(
        message
      )}`;

    window.location.href = orderUrl;
  }

  if (!loaded) {
    return (
      <main className="checkout-page">
        <div className="checkout-loading">
          Loading checkout...
        </div>
      </main>
    );
  }

  if (!cart.length) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <h1>Your cart is empty</h1>

          <p>
            Add some products before going
            to checkout.
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
      <div className="checkout-container">

        <div className="checkout-header">
          <Link href="/cart">
            ← Back to Cart
          </Link>

          <h1>Checkout</h1>

          <p>
            Enter the receiver's details for
            delivery.
          </p>
        </div>

        <div className="checkout-grid">

          <section className="checkout-form">

            <div className="checkout-card">
              <h2>Receiver Details</h2>

              <label>
                Full Name

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
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
                    setPhone(e.target.value)
                  }
                  placeholder="024 000 0000"
                />
              </label>
            </div>

            <div className="checkout-card">
              <h2>Delivery Address</h2>

              <label>
                Address

                <textarea
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  placeholder="House number, street, area..."
                  rows={4}
                />
              </label>

              <div className="checkout-row">

                <label>
                  City

                  <input
                    type="text"
                    value={city}
                    onChange={(e) =>
                      setCity(e.target.value)
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
                      setRegion(e.target.value)
                    }
                    placeholder="Greater Accra"
                  />
                </label>

              </div>
            </div>

            {error && (
              <div className="checkout-error">
                {error}
              </div>
            )}

            <button
              type="button"
              className="place-order"
              onClick={submitOrder}
              disabled={submitting}
            >
              {submitting
                ? "Processing Order..."
                : "Place Order"}
            </button>

          </section>

          <aside className="checkout-summary">

            <div className="checkout-card">
              <h2>Order Summary</h2>

              <div className="checkout-items">

                {cart.map((item) => (
                  <div
                    className="checkout-item"
                    key={item.id}
                  >

                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                      />
                    ) : (
                      <div className="checkout-image-placeholder">
                        NESTA
                      </div>
                    )}

                    <div className="checkout-item-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        {formatPrice(
                          Number(item.price)
                        )}
                      </p>

                      <div className="quantity-control">

                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(
                              item.id,
                              Math.max(
                                1,
                                Number(
                                  item.quantity
                                ) - 1
                              )
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
                            updateCartQuantity(
                              item.id,
                              Number(
                                item.quantity
                              ) + 1
                            )
                          }
                        >
                          +
                        </button>

                        <button
                          type="button"
                          className="remove-item"
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
                        Number(item.price) *
                          Number(
                            item.quantity
                          )
                      )}
                    </strong>

                  </div>
                ))}

              </div>

              <div className="summary-line">
                <span>Subtotal</span>

                <strong>
                  {formatPrice(subtotal)}
                </strong>
              </div>

              <div className="summary-line">
                <span>Delivery</span>

                <strong>
                  Free
                </strong>
              </div>

              <div className="summary-total">
                <span>Total</span>

                <strong>
                  {formatPrice(total)}
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
          padding: 40px 20px 80px;
          color: #111;
        }

        .checkout-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .checkout-header {
          margin-bottom: 35px;
        }

        .checkout-header a {
          color: #111;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        .checkout-header h1 {
          margin: 22px 0 8px;
          font-size: clamp(36px, 7vw, 64px);
          letter-spacing: -3px;
          line-height: 1;
        }

        .checkout-header p {
          color: #666;
          margin: 0;
        }

        .checkout-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1.4fr)
            minmax(320px, 0.8fr);
          gap: 25px;
          align-items: start;
        }

        .checkout-card {
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .checkout-card h2 {
          margin: 0 0 22px;
          font-size: 21px;
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
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 14px;
          font: inherit;
          outline: none;
          background: #fff;
        }

        input:focus,
        textarea:focus {
          border-color: #111;
        }

        textarea {
          resize: vertical;
        }

        .checkout-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .checkout-error {
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
          padding: 16px 20px;
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

        .checkout-item {
          display: grid;
          grid-template-columns:
            65px 1fr auto;
          gap: 12px;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }

        .checkout-item img,
        .checkout-image-placeholder {
          width: 65px;
          height: 65px;
          border-radius: 10px;
          object-fit: cover;
          background: #f1f1f1;
        }

        .checkout-image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 900;
        }

        .checkout-item-info h3 {
          margin: 0 0 5px;
          font-size: 14px;
        }

        .checkout-item-info p {
          margin: 0 0 8px;
          font-size: 13px;
          color: #666;
        }

        .checkout-item > strong {
          font-size: 13px;
          white-space: nowrap;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .quantity-control button {
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 7px;
          min-width: 27px;
          height: 27px;
          cursor: pointer;
        }

        .quantity-control span {
          min-width: 15px;
          text-align: center;
          font-size: 13px;
        }

        .quantity-control .remove-item {
          border: 0;
          margin-left: 4px;
          color: #b00020;
          font-size: 11px;
          width: auto;
          background: transparent;
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          padding-top: 18px;
          font-size: 14px;
          color: #666;
        }

        .summary-line strong {
          color: #111;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 20px;
        }

        .checkout-empty,
        .checkout-loading {
          max-width: 600px;
          margin: 100px auto;
          text-align: center;
          background: #fff;
          padding: 45px 25px;
          border-radius: 18px;
        }

        .checkout-empty h1 {
          margin-top: 0;
        }

        .checkout-empty p {
          color: #666;
        }

        .checkout-empty a {
          display: inline-block;
          margin-top: 15px;
          background: #111;
          color: #fff;
          text-decoration: none;
          padding: 13px 20px;
          border-radius: 10px;
        }

        @media (max-width: 800px) {
          .checkout-page {
            padding: 25px 15px 60px;
          }

          .checkout-grid {
            grid-template-columns: 1fr;
          }

          .checkout-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .checkout-header h1 {
            font-size: 44px;
          }
        }
      `}</style>
    </main>
  );
}
