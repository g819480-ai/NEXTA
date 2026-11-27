
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { categories } from "../../lib/store";
import { useProducts } from "../../lib/useProducts";

function normalizeCategory(value: string): string {
  const text = String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const rules: Record<string, string[]> = {
    "Mobile Phone": ["mobile phone", "smartphone", "iphone", "android phone", "cell phone", "cellphone"],
    "Air Freshener": ["air freshener", "room fragrance", "scent diffuser", "air diffuser"],
    "Rice Cooker": ["rice cooker"],
    "Fridge": ["fridge", "refrigerator", "freezer"],
    "TV": ["television", "smart tv", "led tv", "lcd tv"],
    "Shoes": ["shoe", "sneaker", "sandals", "boots", "footwear"],
    "Clothing": ["clothing", "fashion", "dress", "shirt", "trousers", "jacket", "apparel"],
    "Bags": ["bag", "handbag", "backpack"],
    "Watches": ["watch"],
    "Jewelry": ["jewelry", "jewellery", "necklace", "bracelet", "earrings", "rings"],
    "Beauty": ["beauty", "cosmetics", "makeup", "skincare", "skin care"],
    "Electronics": ["electronics", "headphones", "earphones", "earbuds", "chargers", "bluetooth speaker", "speakers"],
    "Accessories": ["accessories", "caps", "wallets", "sunglasses", "belts"],
    "Home": ["home", "household", "home decor", "kitchen products", "home storage"],
    "Kids": ["kids", "children", "baby", "babies"],
    "Sports": ["sports", "sportswear", "fitness", "gym"],
  };

  for (const [category, keywords] of Object.entries(rules)) {
    if (
      keywords.some(
        (keyword) =>
          text === keyword ||
          text.startsWith(keyword + " ") ||
          text.endsWith(" " + keyword) ||
          text.includes(" " + keyword + " ")
      )
    ) {
      return category;
    }
  }

  return text;
}

export default function ShopPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

  const { products, loading, error, reload } = useProducts();

  const filteredProducts = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return products.filter((product) => {
      const productCategory = normalizeCategory(
        product.category || ""
      );

      const selectedCategory = normalizeCategory(category);

      const matchesCategory =
        category === "All" ||
        productCategory === selectedCategory;

      const productName = String(product.name || "").toLowerCase();
      const productCategoryText = String(product.category || "").toLowerCase();

      const matchesSearch =
        !searchText ||
        productName.includes(searchText) ||
        productCategoryText.includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  async function search1688(
    event: React.FormEvent<HTMLFormElement>
  ) {
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

      if (!response.ok || !data.success) {
        throw new Error(data.error || "1688 search failed");
      }

      await reload();

      setCategory("All");
      setSearch("");

      setSearchMessage(
        `1688 search completed. ${
          data.imported ?? data.count ?? 0
        } products imported.`
      );
    } catch (err) {
      setSearchMessage(
        err instanceof Error
          ? err.message
          : "Unable to search 1688."
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

        <button
          type="submit"
          disabled={searching || !search.trim()}
        >
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
          type="button"
          className={category === "All" ? "active" : ""}
          onClick={() => setCategory("All")}
        >
          All
        </button>

        {categories.map((item) => (
          <button
            type="button"
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
