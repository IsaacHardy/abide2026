const MEDIA_HOST = "https://media.abide2026.com";
const IMAGE_EXT = /\.(webp|png|jpe?g|svg|avif)$/i;

function altFromKey(key) {
  const base = key.replace(/^partner-/, "").replace(IMAGE_EXT, "");
  const explicitMatch = base.match(/__(.+)$/);
  if (explicitMatch) {
    return explicitMatch[1].replace(/-/g, " ");
  }
  return base
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export async function onRequest({ env }) {
  if (!env.MEDIA_BUCKET) {
    return Response.json(
      { error: "MEDIA_BUCKET binding not configured" },
      { status: 500 },
    );
  }

  const partners = [];
  let cursor;
  do {
    const page = await env.MEDIA_BUCKET.list({
      prefix: "partner-",
      cursor,
      limit: 1000,
    });
    for (const obj of page.objects) {
      if (!IMAGE_EXT.test(obj.key)) continue;
      partners.push({
        src: `${MEDIA_HOST}/${obj.key}`,
        alt: altFromKey(obj.key),
      });
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  return Response.json(partners, {
    headers: {
      "cache-control": "public, max-age=300, s-maxage=300",
    },
  });
}
