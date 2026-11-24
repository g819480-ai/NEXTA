import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="page">
      <div className="simple-page">
        <span className="eyebrow">GET IN TOUCH</span>

        <h1>Contact NESTA</h1>

        <p>
          Have a question about a product, order or delivery?
          We&apos;re here to help.
        </p>

        <div className="contact-box">
          <h3>Customer Support</h3>
          <p>Email: support@nesta-store.com</p>
          <p>Hours: Monday – Saturday</p>
        </div>

        <Link href="/shop" className="btn btn-primary">
          Back to Shop
        </Link>
      </div>
    </div>
  );
}
