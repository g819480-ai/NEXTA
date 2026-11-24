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
        { error: "APISH_KEY is not configured in Vercel" },
        { status: 500 }
      );
    }

    const apiUrl = new URL(
      "https://api.api.sh/1688/v1/product"
    );

    apiUrl.searchParams.set("url", url);

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "1688 API request failed",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("1688 import error:", error);

    return NextResponse.json(
      {
        error: "Failed to import 1688 product",
      },
      { status: 500 }
    );
  }
}
