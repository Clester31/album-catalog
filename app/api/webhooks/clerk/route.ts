import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma/prisma"

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new Error("Missing webhook signing secret");

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-signature": svix_signature,
      "svix-timestamp": svix_timestamp,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Webhook verification failed", error);
    return new Response("invalid signature", { status: 400 });
  }

  const { type, data } = event;

  if (type === "user.created") {
    await prisma.user.create({
      data: {
        clerkId: data.id,
        email: data.email_addresses[0]?.email_address ?? "",
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      },
    });
  }

  return new Response("OK", { status: 200 });
}
