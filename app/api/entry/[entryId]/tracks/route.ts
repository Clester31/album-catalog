import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ entryId: string }> },
) {
  try {
    const { entryId } = await params;
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    const tracks = await prisma.track.findMany({
        where: {
            entryId,
        }
    })

    if (!tracks) {
      return NextResponse.json({ error: "tracks not found" }, { status: 404 });
    }

    return NextResponse.json(tracks, { status: 200 })
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch track ratings" },
      { status: 500 },
    );
  }
}
