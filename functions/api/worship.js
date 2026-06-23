const MEDIA_HOST = "https://media.abide2026.com";
const DATA_KEY = "worship.json";

function resolveImg(img) {
  if (typeof img !== "string" || !img) return img;
  if (/^https?:\/\//i.test(img)) return img;
  return `${MEDIA_HOST}/${img.replace(/^\/+/, "")}`;
}

export async function onRequest({ env }) {
  if (!env.MEDIA_BUCKET) {
    return Response.json(
      { error: "MEDIA_BUCKET binding not configured" },
      { status: 500 },
    );
  }

  let bands = [];
  try {
    const obj = await env.MEDIA_BUCKET.get(DATA_KEY);
    if (obj) {
      const parsed = JSON.parse(await obj.text());
      if (Array.isArray(parsed)) {
        bands = parsed.map((b) => ({ ...b, img: resolveImg(b.img) }));
      }
    }
  } catch (e) {
    // Missing or malformed worship.json → degrade to an empty section
    bands = [];
  }

  return Response.json(bands, {
    headers: {
      "cache-control": "public, max-age=300, s-maxage=300",
    },
  });
}
