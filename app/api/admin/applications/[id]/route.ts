import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  sendPartnerApplicationApprovedEmail,
  sendPartnerApplicationRejectedEmail,
} from "@/lib/email";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const application = await prisma.partnerApplication.findUnique({
      where: { id },
      include: {
        adminNotes: {
          include: { admin: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Application not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, application });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: errMessage } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { status, adminNote } = body;

    const application = await prisma.partnerApplication.findUnique({ where: { id } });
    if (!application) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Application not found." } },
        { status: 404 }
      );
    }

    // Update status & create admin note in transaction
    const updated = await prisma.$transaction(async (tx) => {
      const updatedApp = await tx.partnerApplication.update({
        where: { id },
        data: {
          status: status || application.status,
          reviewedBy: admin.id,
        },
      });

      if (adminNote && adminNote.trim()) {
        await tx.adminNote.create({
          data: {
            applicationId: id,
            adminId: admin.id,
            content: adminNote.trim(),
          },
        });
      }

      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          action: "PARTNER_APPLICATION_STATUS_UPDATE",
          resource: "PartnerApplication",
          resourceId: id,
          details: `Updated status from ${application.status} to ${status || application.status}`,
        },
      });

      return updatedApp;
    });

    // Email trigger on status change
    if (status && status !== application.status) {
      if (status === "APPROVED") {
        sendPartnerApplicationApprovedEmail(application.name, application.email, application.type).catch((err: unknown) =>
          console.error("Approval email error:", err)
        );
      } else if (status === "REJECTED") {
        sendPartnerApplicationRejectedEmail(application.name, application.email, application.type).catch((err: unknown) =>
          console.error("Rejection email error:", err)
        );
      }
    }

    return NextResponse.json({
      success: true,
      application: updated,
      message: "Application status updated successfully.",
    });
  } catch (error: unknown) {
    console.error("Patch application error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to update application status." } },
      { status: 500 }
    );
  }
}
