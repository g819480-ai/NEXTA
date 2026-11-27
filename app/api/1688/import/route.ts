import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function fixMojibake(value: unknown): unknown {
  if (typeof value === "string") {
    try {
      const fixed = Buffer.from(value, "latin1").toString("utf8");

      if (
        fixed.includes("�") ||
        fixed === value
      ) {
        return value;
      }

      return fixed;
    } catch {
      return value;
    }
  }

  if (Array.isArray(value)) {
    return value.map(fixMojibake);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        fixMojibake(val),
      ])
    );
  }

  return value;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.APISH_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "APISH_KEY is missing" },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "SUPABASE_SERVICE_ROLE_KEY is missing",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const query = String(body.query || "").trim();
    const page = Number(body.page || 1);

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Missing query" },
        { status: 400 }
      );
    }

    const apiUrl =
      `https://api.api.sh/1688/v1/search?q=${encodeURIComponent(query)}` +
      `&page=${page}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-api-key": apiKey.trim(),
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const raw = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "1688 API request failed",
          details: raw,
        },
        { status: response.status }
      );
    }

    const data = fixMojibake(raw) as {
      items?: any[];
      total?: number;
      page?: number;
      next_page?: number | null;
      count?: number;
      currency?: string;
    };

    const items = Array.isArray(data.items) ? data.items : [];

    /*
     * IMPORTANT:
     * Set CNY_TO_GHS_RATE in Vercel.
     *
     * Example:
     * CNY_TO_GHS_RATE=2.1
     *
     * This keeps the exchange rate configurable instead
     * of hard-coding a potentially outdated rate.
     */
    const exchangeRate = Number(
      process.env.CNY_TO_GHS_RATE || 0
    );

    if (!exchangeRate || exchangeRate <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "CNY_TO_GHS_RATE is not configured",
        },
        { status: 500 }
      );
    }

    const products = items
      .map((item: any) => {
        const offerId = String(item.offer_id || "").trim();
        const name = String(item.title || "").trim();
        const priceCny = Number(item.price || 0);

        if (!offerId || !name || !priceCny) {
          return null;
        }

        const priceGhs = Number(
          (priceCny * exchangeRate * 1.21).toFixed(2)
        );

        const image =
          item.image ||
          (Array.isArray(item.images)
            ? item.images[0]
            : null);

        return {
          name,
          price: priceGhs,
          category: query,
          description:
            `${item.sales_text || ""}`.trim() ||
            `Imported from 1688. Minimum order: ${
              item.min_order || 1
            } ${item.unit || "piece"}.`,
          badge: item.sponsored
            ? "Sponsored"
            : "1688",
          image_url: image || null,
          active: true,

          source_offer_id: offerId,
          source_url: item.url || null,
          source_price_cny: priceCny,
          exchange_rate: exchangeRate,
          source_shop:
            item.shop?.name || null,
        };
      })
      .filter(Boolean);

    if (!products.length) {
      return NextResponse.json({
        success: true,
        message: "No valid products found",
        imported: 0,
        updated: 0,
      });
    }

    const offerIds = products.map(
      (product: any) => product.source_offer_id
    );

    const { data: existing, error: existingError } =
      await supabase
        .from("products")
        .select("source_offer_id")
        .in("source_offer_id", offerIds);

    if (existingError) {
      console.error(
        "Existing products lookup error:",
        existingError
      );

      return NextResponse.json(
        {
          success: false,
          error: existingError.message,
        },
        { status: 500 }
      );
    }

    const existingIds = new Set(
      (existing || []).map(
        (item) => item.source_offer_id
      )
    );

    let imported = 0;
    let updated = 0;

    for (const product of products as any[]) {
      const isExisting = existingIds.has(
        product.source_offer_id
      );

      const { error } = await supabase
        .from("products")
        .upsert(product, {
          onConflict: "source_offer_id",
        });

      if (error) {
        console.error(
          "Product upsert error:",
          error
        );

        return NextResponse.json(
          {
            success: false,
            error: error.message,
            failed_product: product.name,
          },
          { status: 500 }
        );
      }

      if (isExisting) {
        updated++;
      } else {
        imported++;
      }
    }

    return NextResponse.json({
      success: true,
      query,
      page,
      total_available: data.total || 0,
      api_count: data.count || items.length,
      imported,
      updated,
      exchange_rate_cny_to_ghs: exchangeRate,
      markup_percent: 40,
      products_processed: products.length,
      next_page: data.next_page ?? null,
    });
  } catch (error) {
    console.error("1688 import error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to import 1688 products",
      },
      { status: 500 }
    );
  }
}
