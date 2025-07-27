import { prisma } from "@/app/utils/db";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { formatDueDate } from "@/app/utils/formatDueDate";
import requireUser from "@/app/utils/hooks";
import { sendReminderEmail } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  try {
    const session = await requireUser();
    const { invoiceId } = await params;

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const formattedDueDate = formatDueDate({
      invoiceDate: invoiceData.date,
      dueInDays: Number(invoiceData.dueDate),
    });

    await sendReminderEmail({
      recipientName: invoiceData.clientName,
      recipientEmail: invoiceData.clientEmail,
      invoiceNumber: String(invoiceData.invoiceNumber),
      dueDate: formattedDueDate,
      total: formatCurrency({
        amount: invoiceData.total,
        currency: invoiceData.currency as any,
      }),
      downloadUrl: `@/api/invoice/${invoiceData.id}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send reminder email" },
      { status: 500 }
    );
  }
}
