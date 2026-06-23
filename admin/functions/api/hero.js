const MAX_BYTES = 8 * 1024 * 1024;
const IMAGE_TYPES = ["image/webp", "image/png", "image/jpeg", "image/avif"];
const CACHE = "public, max-age=300";

// Fixed R2 keys the live <picture> element references.
const SLOT_KEYS = {
  desktop: ["hero-banner.webp"],
  mobile: ["hero-banner-mobile.webp", "hero-banner-mobile-412w.webp"],
};

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "cache-control": "no-store" } });
}

export async function onRequestPost({ request, env }) {
  if (env.ADMIN_WRITE_ENABLED !== "true") {
    return json({ error: "Uploading is not enabled yet. Set ADMIN_WRITE_ENABLED=true after Cloudflare Access is configured." }, 403);
  }
  if (!env.MEDIA_BUCKET) return json({ error: "MEDIA_BUCKET binding not configured" }, 500);

  let form;
  try {
    form = await request.formData();
  } catch (e) {
    return json({ error: "Expected a multipart form upload." }, 400);
  }

  const file = form.get("file");
  const slot = (form.get("slot") || "").toString();
  const keys = SLOT_KEYS[slot];
  if (!keys) return json({ error: "Invalid slot (use 'desktop' or 'mobile')." }, 400);
  if (!file || typeof file === "string") return json({ error: "No image file was uploaded." }, 400);

  const type = file.type || "";
  const isImage = IMAGE_TYPES.includes(type) || /\.(webp|png|jpe?g|avif)$/i.test(file.name || "");
  if (!isImage) return json({ error: "Image must be a WEBP, PNG, JPG, or AVIF file." }, 400);
  if (file.size > MAX_BYTES) return json({ error: "Image must be 8 MB or smaller." }, 400);

  // Store the same bytes at every key for the slot (mobile has two sizes).
  const bytes = await file.arrayBuffer();
  for (const key of keys) {
    await env.MEDIA_BUCKET.put(key, bytes, {
      httpMetadata: { contentType: type || "image/webp", cacheControl: CACHE },
    });
  }

  return json({ ok: true, keys });
}
