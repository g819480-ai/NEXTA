import { NextResponse } from "next/server";

const SEARCHES = [
  "男装",
  "女装",
  "鞋子",
  "包包",
  "手机配件",
  "电子产品",
  "美妆",
  "家居用品",
  "运动用品",
  "潮流商品",
];

export async function POST() {
  try {
    const apiKey = process.env.APISH_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "APISH_KEY is not configured" },
        { status: 500 }
      );
    }

    const results = [];

    for (const keyword of SEARCHES) {
      const url = new URL("https://api.api.sh/1688/v1/search");
      url.searchParams.set("q", keyword);
      url.searchParams.set("page", "1");

      const response = await fetch(url.toString(), {
        headers: {
          "x-api-key": apiKey,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        results.push({
          keyword,
          success: false,
          error: data,
        });
        continue;
      }

      results.push({
        keyword,
        success: true,
        data,
      });
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("1688 sync error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "1688 sync failed",
      },
      { status: 500 }
    );
  }
}
