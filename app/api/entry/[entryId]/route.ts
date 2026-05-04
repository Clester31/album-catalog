import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ entryId: string }> },
) {
  try {
    const { entryId } = await params;

    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { entryRating, entryReview } = body;

    if (entryRating === undefined && entryReview === undefined) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    const entry = await prisma.entry.findFirst({
      where: {
        id: entryId,
        catalog: { userId: user.id },
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "entry not found" }, { status: 404 });
    }

    const entryData: Record<string, unknown> = {};
    if (entryRating !== undefined) entryData.entryRating = entryRating;
    if (entryReview !== undefined) entryData.entryReview = entryReview;

    const [updatedEntry] = await prisma.$transaction([
      prisma.entry.update({
        where: { id: entryId },
        data: entryData,
        include: { tracks: true },
      }),
    ]);

    return NextResponse.json(updatedEntry, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 },
    );
  }
}
