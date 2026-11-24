import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SEARCHES = [
  { keyword: "男装", category: "Men's Fashion" },
  { keyword: "女装", category: "Women's Fashion" },
  { keyword: "鞋子", category: "Shoes" },
  { keyword: "包包", category: "Bags" },
  { keyword: "手机配件", category: "Phone Accessories" },
  { keyword: "电子产品", category: "Electronics" },
  { keyword: "美妆", category: "Beauty" },
  { keyword: "家居用品", category: "Home & Living" },
  { keyword: "运动用品", category: "Sports" },
  { keyword: "潮流商品", category: "Trending" },
];

function calculateSellingPrice(cnyPrice: number) {
  // Temporary exchange-rate assumption.
  // We will make this configurable later.
  const cnyToGhs = 1.55;

  const costInGhs = cnyPrice * cnyToGhs;

  // 40% NESTA margin
  return Number((costInGhs * 1.4).toFixed(2));
}

function getImage(item: any) {
  return (
    item.image_url ||
    item.image ||
    item.pic_url ||
    item.pic ||
    item.main_image ||
    ""
  );
}

function getName(item: any) {
  return (
    item.title ||
    item.name ||
    item.subject ||
    "NESTA Product"
  );
}

function getPrice(item: any) {
  const possiblePrices = [
    item.price,
    item.min_price,
    item.sale_price,
    item.wholesale_price,
  ];

  for (const value of possiblePrices) {
    const number = Number(value);

    if (Number.isFinite(number) && number > 0) {
      return number;
    }
  }

  return 0;
}

function getStock(item: any) {
  const possibleStock = [
    item.stock,
    item.quantity,
    item.inventory,
  ];

  for (const value of possibleStock) {
    const number = Number(value);

    if (Number.isFinite(number) && number >= 0) {
      return Math.floor(number);
    }
  }

  return 0;
}

export async function POST() {
  try {
    const apiKey = process.env.APISH_KEY;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "APISH_KEY is missing" },
        { status: 500 }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error:
            "Supabase server credentials are missing",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceKey
    );

    let imported = 0;
    let skipped = 0;
    const errors: any[] = [];

    for (const search of SEARCHES) {
      try {
        const apiUrl = new URL(
          "https://api.api.sh/1688/v1/search"
        );

        apiUrl.searchParams.set("q", search.keyword);
        apiUrl.searchParams.set("page", "1");

        const response = await fetch(apiUrl.toString(), {
          headers: {
            "x-api-key": apiKey,
            Accept: "application/json",
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          errors.push({
            category: search.category,
            error: data,
          });

          continue;
        }

        const items =
          data?.items ||
          data?.products ||
          data?.data?.items ||
          data?.data?.products ||
          [];

        if (!Array.isArray(items)) {
          errors.push({
            category: search.category,
            error: "No product array found in API response",
          });

          continue;
        }

        for (const item of items) {
          const name = getName(item);
          const imageUrl = getImage(item);
          const cnyPrice = getPrice(item);
          const stock = getStock(item);

          if (!name || !imageUrl || !cnyPrice) {
            skipped++;
            continue;
          }

          const sellingPrice =
            calculateSellingPrice(cnyPrice);

          const description =
            item.description ||
            item.desc ||
            `${name} imported from 1688.`;

          const { error } = await supabase
            .from("products")
            .insert({
              name,
              price: sellingPrice,
              category: search.category,
              description,
              image_url: imageUrl,
              badge: "1688",
              stock,
              active: stock > 0,
            });

          if (error) {
            errors.push({
              product: name,
              error: error.message,
            });

            continue;
          }

          imported++;
        }
      } catch (error) {
        errors.push({
          category: search.category,
          error:
            error instanceof Error
              ? error.message
              : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      errors,
    });
  } catch (error) {
    console.error("NESTA 1688 sync failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown sync error",
      },
      { status: 500 }
    );
  }
}
