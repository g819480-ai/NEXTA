
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { categories } from "../../lib/store";
import { useProducts } from "../../lib/useProducts";

export default function ShopPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { products, loading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  return (
    <div className="page">
      <section className="shop-header">
        <div>
          <span className="eyebrow">NESTA STORE</span>
          <h1>Shop Everything</h1>
          <p>Find something made for you.</p>
        </div>

        <Link href="/cart" className="btn btn-light">
          View Cart
        </Link>
      </section>

      <div className="shop-controls">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="category-pills">
        <button
          className={category === "All" ? "active" : ""}
          onClick={() => setCategory("All")}
        >
          All
        </button>

        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state">
          <h2>Loading products...</h2>
          <p>Please wait while NESTA loads the store.</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <h2>Unable to load products</h2>
          <p>{error}</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No products found</h2>
          <p>Try another search or category.</p>
        </div>
      )}
    </div>
  );
}
