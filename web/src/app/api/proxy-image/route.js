export async function GET(request) {
  try {
    const url = new URL(request.url);
    const imageUrl = url.searchParams.get("url");

    if (!imageUrl) {
      return new Response("Missing url parameter", { status: 400 });
    }

    // Only allow wikimedia images
    const allowed = ["commons.wikimedia.org", "upload.wikimedia.org"];
    let parsedUrl;
    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      return new Response("Invalid URL", { status: 400 });
    }

    const isAllowed = allowed.some((domain) =>
      parsedUrl.hostname.endsWith(domain),
    );
    if (!isAllowed) {
      return new Response("Domain not allowed", { status: 403 });
    }

    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent": "TarotJournalApp/1.0",
      },
    });

    if (!res.ok) {
      return new Response("Failed to fetch image", { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new Response("Proxy error", { status: 500 });
  }
}
