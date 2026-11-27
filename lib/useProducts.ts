
"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Product } from "./store";

const PAGE_SIZE = 60;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let allProducts: Product[] = [];
      let start = 0;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, price, category, description, badge, image_url")
          .eq("active", true)
          .order("created_at", { ascending: false })
          .range(start, start + PAGE_SIZE - 1);

        if (error) throw error;

        const batch = (data || []).map((item) => ({
          ...item,
          price: Number(item.price),
          description: item.description || "",
        })) as Product[];

        allProducts = [...allProducts, ...batch];
        hasMore = batch.length === PAGE_SIZE;
        start += PAGE_SIZE;
      }

      setProducts(allProducts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { products, loading, error, reload };
}
