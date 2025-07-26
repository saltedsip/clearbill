import { prisma } from "@/app/utils/db";
import requireUser from "@/app/utils/hooks";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const session = await requireUser();
  const { userId } = params;

  if (!session || session.user?.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { firstName, lastName, email, address } = await req.json();

  if (!firstName || !lastName || !email || !address) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    // Optional: check for email uniqueness
    const existing = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName, email, address },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
