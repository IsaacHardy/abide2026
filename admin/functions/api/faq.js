const DATA_KEY = "faq.json";

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "cache-control": "no-store" } });
}

function isNonEmpty(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function validate(arr) {
  if (!Array.isArray(arr)) return "Body must be an array of FAQ items.";
  for (let i = 0; i < arr.length; i++) {
    const it = arr[i];
    const where = "Item " + (i + 1);
    if (!it || typeof it !== "object") return where + ": invalid entry.";
    if (!isNonEmpty(it.category)) return where + ": category is required.";
    if (!isNonEmpty(it.question)) return where + ": question is required.";
    if (!isNonEmpty(it.answer)) return where + ": answer is required.";
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
    return json({ error: "faq.json in R2 is malformed" }, 500);
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

  // Normalize: keep only the known fields, trimmed.
  if (Array.isArray(body)) {
    body = body.map((it) => ({
      category: typeof it.category === "string" ? it.category.trim() : it.category,
      question: typeof it.question === "string" ? it.question.trim() : it.question,
      answer: typeof it.answer === "string" ? it.answer.trim() : it.answer,
    }));
  }

  const err = validate(body);
  if (err) return json({ error: err }, 400);

  await env.MEDIA_BUCKET.put(DATA_KEY, JSON.stringify(body, null, 2), {
    httpMetadata: { contentType: "application/json" },
  });
  return json({ ok: true });
}
