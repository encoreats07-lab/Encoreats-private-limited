import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const city = searchParams.get("city");

    const where: any = {};
    if (type && type !== "ALL") where.type = type;
    if (status && status !== "ALL") where.status = status;
    if (city && city !== "ALL") where.city = { contains: city, mode: "insensitive" };

    const applications = await prisma.partnerApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        adminNotes: {
          include: {
            admin: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error: any) {
    if (error.message?.startsWith("FORBIDDEN") || error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Admin access required." } },
        { status: 403 }
      );
    }
    console.error("Admin applications error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch applications." } },
      { status: 500 }
    );
  }
}
