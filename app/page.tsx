import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { products } from "../lib/store";

export default function HomePage() {
  const featured = products.slice(0, 4);

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">WELCOME TO NESTA</span>

          <h1>
            Your Style.
            <br />
            Your Choice.
          </h1>

          <p>
            Discover fashion, footwear, accessories, electronics and more —
            all in one place.
          </p>

          <div className="hero-actions">
            <Link href="/shop" className="btn btn-primary">
              Shop Now
            </Link>

            <Link href="/about" className="btn btn-light">
              Discover NESTA
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SHOP COLLECTION</span>
            <h2>Featured Products</h2>
          </div>

          <Link href="/shop" className="view-all">
            View all →
          </Link>
        </div>

        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="categories-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EXPLORE</span>
            <h2>Shop by Category</h2>
          </div>
        </div>

        <div className="category-grid">
          {[
            ["Fashion", "Clothing & style"],
            ["Shoes", "Step into style"],
            ["Bags", "Carry it better"],
            ["Electronics", "Smart essentials"],
            ["Accessories", "Complete your look"],
            ["Home & Living", "Make it yours"],
          ].map(([name, description]) => (
            <Link
              href={`/shop?category=${encodeURIComponent(name)}`}
              key={name}
              className="category-card"
            >
              <h3>{name}</h3>
              <p>{description}</p>
              <span>Shop now →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="promo-section">
        <div>
          <span className="eyebrow">NESTA</span>
          <h2>Style made simple.</h2>
          <p>
            Find what you love, add it to your cart and make it yours.
          </p>
        </div>

        <Link href="/shop" className="btn btn-primary">
          Start Shopping
        </Link>
      </section>
    </div>
  );
}
