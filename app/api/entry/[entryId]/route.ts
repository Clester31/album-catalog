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
    const { entryRating, entryReview, entryListeningDate } = body;

    if (entryRating === undefined && entryReview === undefined && entryListeningDate === undefined) {
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
    if (entryListeningDate !== undefined) entryData.entryListeningDate = entryListeningDate;

    console.log("entryData: ", entryData);

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

export async function DELETE(
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

    const entry = await prisma.entry.findFirst({
      where: {
        id: entryId,
        catalog: { userId: user.id },
      },
    });

    if (!entry) {
      return NextResponse.json({ error: "entry not found" }, { status: 404 });
    }

    const [, removedEntry] = await prisma.$transaction([
      prisma.track.deleteMany({
        where: { entryId }
      }),
      prisma.entry.delete({
        where: { id: entryId }
      }),
    ]);

    return NextResponse.json(removedEntry, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 },
    );
  }
}