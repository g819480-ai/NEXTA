import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="page">
      <div className="simple-page">
        <span className="eyebrow">NESTA ACCOUNT</span>

        <h1>My Account</h1>

        <p>
          Your NESTA account area will be available here.
        </p>

        <Link href="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
