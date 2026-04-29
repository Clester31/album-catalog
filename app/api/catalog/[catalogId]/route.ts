import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ catalogId: string }> },
) {
  try {
    const { catalogId } = await params;

    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      entryArtist,
      entryTitle,
      entryCoverArt,
      entryExternalId,
      entryRating,
      entryReleaseDate,
      entryReview,
      entryTracks,
    } = body;

    console.log(body);

    if (
      !entryArtist ||
      !entryTitle ||
      !entryCoverArt ||
      !entryExternalId ||
      entryRating === undefined ||
      entryRating === null ||
      !entryTracks
    ) {
      return NextResponse.json({ error: "Incorrect Body" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    const catalog = await prisma.catalog.findFirst({
      where: {
        id: catalogId,
        userId: user.id,
      },
    });

    if (!catalog) {
      return NextResponse.json({ error: "Catalog Not Found" }, { status: 404 });
    }

    const entry = await prisma.entry.create({
      data: {
        catalogId: catalogId,
        entryArtist,
        entryTitle,
        entryCoverArt,
        entryExternalId,
        entryRating,
        entryReleaseDate,
        entryReview,
        tracks: {
          create: entryTracks.map(
            (track: { name: string; duration: string }) => ({
              trackTitle: track.name,
              trackDuration: parseInt(track.duration) || 0,
              trackRating: 0,
              trackReview: "",
            }),
          ),
        },
      },
      include: {
        tracks: true,
      },
    });

    return NextResponse.json(entry, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add entry to catalog" },
      { status: 500 },
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ catalogId: string }> },
) {
  try {
    const { catalogId } = await params;
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

    const entries = await prisma.entry.findMany({
      where: {
        catalogId,
        catalog: { userId: user.id }, 
      },
      include: { tracks: true },
    });

    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch catalog entries" },
      { status: 500 },
    );
  }
}
