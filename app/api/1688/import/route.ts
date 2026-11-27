import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const APISH_URL = "https://api.api.sh/1688/v1/search";

function fixMojibake(value: string): string {
  if (!/[ÃÂåæçèéêëìíîïðñòóôõöùúûüý]/.test(value)) {
    return value;
  }

  try {
    const fixed = Buffer.from(value, "latin1").toString("utf8");

    if (fixed.includes("�")) {
      return value;
    }

    return fixed;
  } catch {
    return value;
  }
}

function cleanValue(value: any): any {
  if (typeof value === "string") {
    return fixMojibake(value);
  }

  if (Array.isArray(value)) {
    return value.map(cleanValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        cleanValue(val),
      ])
    );
  }

  return value;
}

async function importProducts(query: string, page: number) {
  const apiKey = process.env.APISH_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const exchangeRate = Number(process.env.CNY_TO_GHS_RATE);

  if (!apiKey) {
    throw new Error("APISH_KEY is missing");
  }

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
  }

  if (!exchangeRate || exchangeRate <= 0) {
    throw new Error("CNY_TO_GHS_RATE is missing or invalid");
  }

  const supabase = createClient(
    supabaseUrl,
    serviceRoleKey
  );

  const url =
    `${APISH_URL}?q=${encodeURIComponent(query)}&page=${page}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": apiKey.trim(),
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(
      data.error || `API.SH request failed: ${response.status}`
    );
  }

  const items = cleanValue(data.items || []);

  if (!items.length) {
    return {
      success: true,
      imported: 0,
      updated: 0,
      products_processed: 0,
      next_page: data.next_page ?? null,
      message: "No products returned from 1688",
    };
  }

  const products = items
    .map((item: any) => {
      const priceCny = Number(item.price);

      if (!item.offer_id || !priceCny) {
        return null;
      }

      const priceGhs = Number(
        (priceCny * exchangeRate * 1.25).toFixed(2)
      );

      const imageUrl =
        item.image ||
        (Array.isArray(item.images) ? item.images[0] : null);

      return {
        name: item.title || `1688 Product ${item.offer_id}`,
        price: priceGhs,
        category: query,
        description:
          item.sales_text ||
          `${item.title || "1688 product"} imported from 1688.`,
        badge: item.sponsored ? "Sponsored" : "1688",
        image_url: imageUrl,
        active: true,

        source_offer_id: String(item.offer_id),
        source_url: item.url || null,
        source_price_cny: priceCny,
        exchange_rate: exchangeRate,
        source_shop: item.shop?.name || null,
      };
    })
    .filter(Boolean);

  if (!products.length) {
    return {
      success: true,
      imported: 0,
      updated: 0,
      products_processed: 0,
      message: "Products were returned but none were valid for import",
    };
  }

  const { error } = await supabase
    .from("products")
    .upsert(products, {
      onConflict: "source_offer_id",
    });

  if (error) {
    throw new Error(`Supabase import failed: ${error.message}`);
  }

  return {
    success: true,
    imported: products.length,
    updated: 0,
    products_processed: products.length,
    next_page: data.next_page ?? null,
    exchange_rate: exchangeRate,
    markup: "25%",
    query,
    page,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") || "shoes";
    const page = Number(searchParams.get("page") || "1");

    const result = await importProducts(query, page);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[1688 IMPORT ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Import failed",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const query = body.query || "shoes";
    const page = Number(body.page || 1);

    const result = await importProducts(query, page);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[1688 IMPORT ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Import failed",
      },
      { status: 500 }
    );
  }
}
