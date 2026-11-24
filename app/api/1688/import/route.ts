import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "1688 product URL is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.APISH_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "APISH_KEY is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.api.sh/1688/v1/product?url=${encodeURIComponent(url)}`,
      {
        headers: {
          "x-api-key": apiKey,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "1688 API request failed", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to import 1688 product" },
      { status: 500 }
    );
  }
}
