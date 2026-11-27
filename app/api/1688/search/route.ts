import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q");

    if (!q) {
      return NextResponse.json(
        { error: "Missing search query" },
        { status: 400 }
      );
    }

    const apiKey = process.env.APISH_KEY;

    if (!apiKey) {
      console.error("APISH_KEY is missing");

      return NextResponse.json(
        { error: "APISH_KEY is not configured on the server" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.api.sh/1688/v1/search?q=${encodeURIComponent(q)}`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey.trim(),
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    console.log("1688 API status:", response.status);

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
    console.error("1688 connection error:", error);

    return NextResponse.json(
      {
        error: "Failed to connect to 1688 API",
      },
      { status: 500 }
    );
  }
}
