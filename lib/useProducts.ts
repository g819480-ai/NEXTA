
"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Product } from "./store";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, category, description, badge, image_url")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setProducts(
          (data || []).map((item) => ({
            ...item,
            price: Number(item.price),
            description: item.description || "",
          })) as Product[]
        );
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  return { products, loading, error };
}
