
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { categories } from "../../lib/store";
import { useProducts } from "../../lib/useProducts";

export default function ShopPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const { products, loading, error, reload } = useProducts();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "All" ||
        product.category?.toLowerCase().trim() === category.toLowerCase().trim();

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  async function search1688(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim();

    if (!query || searching) return;

    setSearching(true);
    setSearchMessage(`Searching 1688 for "${query}"...`);

    try {
      const response = await fetch(
        `/api/1688/import?q=${encodeURIComponent(query)}&page=1`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "1688 search failed");
      }

      await reload();

      setCategory("All");
      setSearchMessage(
        `1688 search completed. ${data.imported ?? data.count ?? 0} products imported.`
      );
    } catch (err) {
      setSearchMessage(
        err instanceof Error ? err.message : "Unable to search 1688."
      );
    } finally {
      setSearching(false);
    }
  }

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

      <form className="shop-controls" onSubmit={search1688}>
        <input
          type="search"
          placeholder="Search anything on 1688..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit" disabled={searching || !search.trim()}>
          {searching ? "Searching..." : "Search 1688"}
        </button>

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
      </form>

      {searchMessage && (
        <p className="search-message">{searchMessage}</p>
      )}

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
