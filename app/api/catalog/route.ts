import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { catalogName, catalogDescription, catalogColor } = body;

    if (!catalogName || !catalogDescription || !catalogColor) {
      return NextResponse.json({ error: "Incorrect Body" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    const newCatalog = await prisma.catalog.create({
      data: {
        catalogTitle: catalogName,
        catalogDescription: catalogDescription,
        catalogColor: catalogColor,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return NextResponse.json(newCatalog, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create catalog" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: { clerkId },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    const allUserCatalogs = await prisma.catalog.findMany({
      where: {
        userId: user.id
      }
    });

    return NextResponse.json(allUserCatalogs, { status: 200 })
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch all user catalogs" },
      { status: 500 },
    );
  }
}