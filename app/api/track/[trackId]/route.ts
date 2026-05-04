import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ trackId: string }> },
) {
  try {
    const { trackId } = await params;

    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { trackRating, trackReview } = body;

    console.log(trackRating, trackReview)

    if (trackRating === undefined && trackReview === undefined) {
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

    const trackIdNo = Number(trackId);

    const track = await prisma.track.findFirst({
      where: {
        id: trackIdNo,
        entry: {
          catalog: { userId: user.id }, 
        },
      },
    });

    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    const trackData: { trackRating?: number; trackReview?: string } = {};
    if (trackRating !== undefined) trackData.trackRating = trackRating;
    if (trackReview !== undefined) trackData.trackReview = trackReview;

    const updatedTrack = await prisma.track.update({
      where: { id: trackIdNo },
      data: trackData,
    });

    return NextResponse.json(updatedTrack, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update track" },
      { status: 500 },
    );
  }
}