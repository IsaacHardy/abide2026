const MEDIA_HOST = "https://media.abide2026.com";
const IMAGE_EXT = /\.(webp|png|jpe?g|svg|avif)$/i;

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "cache-control": "no-store" } });
}

// Same alt derivation as the live site's functions/api/partners.js, so the
// admin shows exactly what the marquee will show.
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

export async function onRequestGet({ env }) {
  if (!env.MEDIA_BUCKET) return json({ error: "MEDIA_BUCKET binding not configured" }, 500);

  const partners = [];
  let cursor;
  do {
    const page = await env.MEDIA_BUCKET.list({ prefix: "partner-", cursor, limit: 1000 });
    for (const obj of page.objects) {
      if (!IMAGE_EXT.test(obj.key)) continue;
      partners.push({ key: obj.key, alt: altFromKey(obj.key), url: `${MEDIA_HOST}/${obj.key}` });
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  partners.sort((a, b) => a.key.localeCompare(b.key));
  return json(partners);
}

export async function onRequestDelete({ request, env }) {
  if (env.ADMIN_WRITE_ENABLED !== "true") {
    return json({ error: "Editing is not enabled yet. Set ADMIN_WRITE_ENABLED=true after Cloudflare Access is configured." }, 403);
  }
  if (!env.MEDIA_BUCKET) return json({ error: "MEDIA_BUCKET binding not configured" }, 500);

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const key = body && body.key;
  // Only ever delete partner logos through this endpoint.
  if (typeof key !== "string" || !key.startsWith("partner-") || !IMAGE_EXT.test(key)) {
    return json({ error: "Refusing to delete: not a partner logo key." }, 400);
  }

  await env.MEDIA_BUCKET.delete(key);
  return json({ ok: true });
}
