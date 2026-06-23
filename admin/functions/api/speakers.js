const DATA_KEY = "speakers.json";
const BRAND = ["#e0dd90", "#b7ceca", "#ff8d53", "#f26ba4", "#fde6d3", "#f0a398"];

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "cache-control": "no-store" } });
}

function isNonEmpty(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function validate(arr) {
  if (!Array.isArray(arr)) return "Body must be an array of speakers.";
  for (let i = 0; i < arr.length; i++) {
    const s = arr[i];
    const where = "Speaker " + (i + 1);
    if (!s || typeof s !== "object") return where + ": invalid entry.";
    if (!isNonEmpty(s.name)) return where + ": name is required.";
    if (!isNonEmpty(s.bio)) return where + ": bio is required.";
    if (!isNonEmpty(s.img)) return where + ": image is required.";
    if (s.alt != null && typeof s.alt !== "string") return where + ": alt must be text.";
    if (s.focus != null && typeof s.focus !== "string") return where + ": focus must be text.";
    for (const k of ["cardBg", "pillBg", "pillText"]) {
      if (s[k] != null && !BRAND.includes(String(s[k]).toLowerCase())) {
        return where + ": " + k + " must be a brand color.";
      }
    }
  }
  return null;
}

// Reads are harmless (same data the public site serves).
export async function onRequestGet({ env }) {
  if (!env.MEDIA_BUCKET) return json({ error: "MEDIA_BUCKET binding not configured" }, 500);
  const obj = await env.MEDIA_BUCKET.get(DATA_KEY);
  if (!obj) return json([]);
  try {
    const parsed = JSON.parse(await obj.text());
    return json(Array.isArray(parsed) ? parsed : []);
  } catch (e) {
    return json({ error: "speakers.json in R2 is malformed" }, 500);
  }
}

// Writes are gated by Cloudflare Access (edge) plus a fail-closed kill switch
// so there is no open-write window before Access is configured.
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
