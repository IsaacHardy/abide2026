const DATA_KEY = "worship.json";
const BRAND = ["#e0dd90", "#b7ceca", "#ff8d53", "#f26ba4", "#fde6d3", "#f0a398"];

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "cache-control": "no-store" } });
}

function isNonEmpty(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function validate(arr) {
  if (!Array.isArray(arr)) return "Body must be an array of bands.";
  for (let i = 0; i < arr.length; i++) {
    const b = arr[i];
    const where = "Band " + (i + 1);
    if (!b || typeof b !== "object") return where + ": invalid entry.";
    if (!isNonEmpty(b.name)) return where + ": name is required.";
    if (!isNonEmpty(b.role)) return where + ": role is required.";
    if (!isNonEmpty(b.img)) return where + ": image is required.";
    if (b.alt != null && typeof b.alt !== "string") return where + ": alt must be text.";
    for (const k of ["cardBg", "pillBg", "pillText"]) {
      if (b[k] != null && !BRAND.includes(String(b[k]).toLowerCase())) {
        return where + ": " + k + " must be a brand color.";
      }
    }
  }
  return null;
}

export async function onRequestGet({ env }) {
  if (!env.MEDIA_BUCKET) return json({ error: "MEDIA_BUCKET binding not configured" }, 500);
  const obj = await env.MEDIA_BUCKET.get(DATA_KEY);
  if (!obj) return json([]);
  try {
    const parsed = JSON.parse(await obj.text());
    return json(Array.isArray(parsed) ? parsed : []);
  } catch (e) {
    return json({ error: "worship.json in R2 is malformed" }, 500);
  }
}

export async function onRequestPut({ request, env }) {
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

  const err = validate(body);
  if (err) return json({ error: err }, 400);

  await env.MEDIA_BUCKET.put(DATA_KEY, JSON.stringify(body, null, 2), {
    httpMetadata: { contentType: "application/json" },
  });
  return json({ ok: true });
}
