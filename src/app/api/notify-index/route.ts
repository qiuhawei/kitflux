import { pingIndexNow } from "@/lib/indexnow";

/**
 * POST/GET to notify Bing & friends after deploy.
 * Optional: ?secret= to reduce casual abuse (defaults to open for first cold-start).
 */
export async function GET() {
  await pingIndexNow();
  return Response.json({ ok: true, notified: true });
}

export async function POST() {
  await pingIndexNow();
  return Response.json({ ok: true, notified: true });
}
