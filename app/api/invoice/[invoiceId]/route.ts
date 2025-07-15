import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import { formatDueDate } from "@/app/utils/formatDueDate";
import { formatCurrency } from "@/app/utils/formatCurrency";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  const { invoiceId } = await params;

  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    select: {
      total: true,
      date: true,
      dueDate: true,
      fromName: true,
      fromEmail: true,
      fromAddress: true,
      clientName: true,
      clientEmail: true,
      clientAddress: true,
      currency: true,
      invoiceName: true,
      invoiceNumber: true,
      note: true,
      invoiceItemDescription: true,
      invoiceItemQuantity: true,
      invoiceItemRate: true,
    },
  });

  if (!data) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  //set font
  pdf.setFont("helventica");

  //set header
  pdf.setFontSize(24);
  pdf.text(data.invoiceName, 20, 20);

  // From Section
  pdf.setFontSize(12);
  pdf.text("From", 20, 40);
  pdf.setFontSize(10);
  pdf.text([data.fromName, data.fromEmail, data.fromAddress], 20, 45);

  // To Section
  pdf.setFontSize(12);
  pdf.text("Bill to", 20, 70);
  pdf.setFontSize(10);
  pdf.text([data.clientName, data.clientEmail, data.clientAddress], 20, 75);

  // Invoice details
  pdf.setFontSize(10);
  pdf.text(`Invoice Number: #${data.invoiceNumber}`, 120, 40);
  pdf.text(
    `Date: ${new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(data.date)}`,
    120,
    45
  );

  const formattedDueDate = formatDueDate({
    invoiceDate: data.date,
    dueInDays: Number(data.dueDate),
  });

  pdf.text(`Due Date: ${formattedDueDate}`, 120, 50);

  // Item  table header
  pdf.setFontSize(10);
  pdf.setFont("helventica", "bold");
  pdf.text("Description", 20, 100);
  pdf.text("Quantity", 100, 100);
  pdf.text("Rate", 130, 100);
  pdf.text("Total", 160, 100);

  // Draw header line
  pdf.line(20, 102, 190, 102);

  // Item details
  pdf.setFont("helventica", "normal");
  pdf.text(data.invoiceItemDescription, 20, 110);
  pdf.text(data.invoiceItemQuantity.toString(), 100, 110);
  pdf.text(
    formatCurrency({
      amount: data.invoiceItemRate,
      currency: data.currency as any,
    }),
    130,
    110
  );
  pdf.text(
    formatCurrency({
      amount: data.total,
      currency: data.currency as any,
    }),
    160,
    110
  );

  // Total Section
  pdf.line(20, 115, 190, 115);
  pdf.setFont("helventica", "bold");
  pdf.text(`Total (${data.currency})`, 130, 130);
  pdf.text(
    formatCurrency({
      amount: data.total,
      currency: data.currency as any,
    }),
    160,
    130
  );

  // Note

  if (data.note) {
    pdf.setFont("helventica");
    pdf.setFontSize(10);
    pdf.text("Note:", 20, 150);
    pdf.text(data.note, 20, 155);
  }

  // generate pdf as buffer
  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  // return pdf as download
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
