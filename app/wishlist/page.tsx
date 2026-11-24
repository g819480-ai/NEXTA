import Link from "next/link";

export default function WishlistPage() {
  return (
    <div className="page">
      <div className="simple-page">
        <span className="eyebrow">NESTA</span>

        <h1>Wishlist</h1>

        <p>
          Save your favorite products here for later.
        </p>

        <Link href="/shop" className="btn btn-primary">
          Explore Products
        </Link>
      </div>
    </div>
  );
}
