import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "cbu01.alicdn.com",
  "img.alicdn.com",
  "alicdn.com",
];

export async function GET(request: NextRequest) {
  try {
    const imageUrl = request.nextUrl.searchParams.get("url");

    if (!imageUrl) {
      return new NextResponse("Missing image URL", { status: 400 });
    }

    const url = new URL(imageUrl);

    if (
      url.protocol !== "https:" ||
      !ALLOWED_HOSTS.some(
        (host) =>
          url.hostname === host ||
          url.hostname.endsWith("." + host)
      )
    ) {
      return new NextResponse("Image host not allowed", { status: 403 });
    }

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "image/*,*/*;q=0.8",
        Referer: "https://detail.1688.com/",
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1",
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      return new NextResponse("Unable to fetch image", {
        status: response.status,
      });
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "image/jpeg",
        "Cache-Control":
          "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse("Image proxy error", { status: 500 });
  }
}
