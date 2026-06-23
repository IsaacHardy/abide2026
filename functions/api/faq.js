const DATA_KEY = "faq.json";

export async function onRequest({ env }) {
  if (!env.MEDIA_BUCKET) {
    return Response.json(
      { error: "MEDIA_BUCKET binding not configured" },
      { status: 500 },
    );
  }

  let faq = [];
  try {
    const obj = await env.MEDIA_BUCKET.get(DATA_KEY);
    if (obj) {
      const parsed = JSON.parse(await obj.text());
      if (Array.isArray(parsed)) faq = parsed;
    }
  } catch (e) {
    faq = [];
  }

  return Response.json(faq, {
    headers: {
      "cache-control": "public, max-age=300, s-maxage=300",
    },
  });
}
