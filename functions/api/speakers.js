const MEDIA_HOST = "https://media.abide2026.com";
const DATA_KEY = "speakers.json";

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

  let speakers = [];
  try {
    const obj = await env.MEDIA_BUCKET.get(DATA_KEY);
    if (obj) {
      const parsed = JSON.parse(await obj.text());
      if (Array.isArray(parsed)) {
        speakers = parsed.map((s) => ({ ...s, img: resolveImg(s.img) }));
      }
    }
  } catch (e) {
    // Missing or malformed speakers.json → degrade to an empty section
    speakers = [];
  }

  return Response.json(speakers, {
    headers: {
      "cache-control": "public, max-age=300, s-maxage=300",
    },
  });
}
