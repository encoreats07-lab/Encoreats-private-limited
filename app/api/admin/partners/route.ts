import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isAuthorized(req: Request) {
  const authHeader = req.headers.get("authorization");
  const adminSecret = process.env.ADMIN_SECRET || "encoreats_super_secret_admin_key";
  if (authHeader && authHeader === `Bearer ${adminSecret}`) {
    return true;
  }
  return false;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized admin access." } },
      { status: 401 }
    );
  }

  try {
    const applications = await prisma.partnerApplication.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: applications,
    });
  } catch (error: any) {
    console.error("API /api/admin/partners GET Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch applications." } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Unauthorized admin access." } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Missing id or status." } },
        { status: 400 }
      );
    }

    const updated = await prisma.partnerApplication.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error("API /api/admin/partners PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to update application status." } },
      { status: 500 }
    );
  }
}
