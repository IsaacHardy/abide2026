const MAX_BYTES = 8 * 1024 * 1024;
const TYPE_EXT = {
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/avif": "avif",
};

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "cache-control": "no-store" } });
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
  const name = (form.get("name") || "").toString();
  if (!file || typeof file === "string") return json({ error: "No image file was uploaded." }, 400);

  let ext = TYPE_EXT[file.type];
  if (!ext) {
    const m = String(file.name || "").toLowerCase().match(/\.(webp|png|jpe?g|avif)$/);
    if (m) ext = m[1] === "jpeg" ? "jpg" : m[1];
  }
  if (!ext) return json({ error: "Image must be a WEBP, PNG, JPG, or AVIF file." }, 400);
  if (file.size > MAX_BYTES) return json({ error: "Image must be 8 MB or smaller." }, 400);

  let slug = slugify(name);
  if (!slug) slug = slugify(String(file.name || "").replace(/\.[^.]+$/, "")) || "speaker";
  const key = "speaker-" + slug + "." + ext;

  await env.MEDIA_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "image/" + ext },
  });

  return json({ filename: key });
}
