import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url, offer_id } = await request.json();

    const apiKey = process.env.APISH_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "APISH_KEY is missing from Vercel" },
        { status: 500 }
      );
    }

    if (!url && !offer_id) {
      return NextResponse.json(
        { error: "1688 URL or offer_id is required" },
        { status: 400 }
      );
    }

    const apiUrl = new URL(
      "https://api.api.sh/1688/v1/product"
    );

    if (offer_id) {
      apiUrl.searchParams.set("offer_id", offer_id);
    } else {
      apiUrl.searchParams.set("url", url);
    }

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          status: response.status,
          api_error: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      product: data,
    });
  } catch (error) {
    console.error("1688 import error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown 1688 import error",
      },
      { status: 500 }
    );
  }
}
