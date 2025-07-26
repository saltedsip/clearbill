"use server";

import requireUser from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import {
  invoiceSchema,
  onboardingSchema,
  userSettingsSchema,
} from "./utils/zodSchemas";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
import { sendInvoiceEmail, sendInvoiceUpdateEmail } from "./utils/mailtrap";
import { formatCurrency } from "./utils/formatCurrency";
import { formatDueDate } from "./utils/formatDueDate";

export async function onboardUser(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }
  const data = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
    },
  });

  return redirect("/dashboard");
}

export async function createInvoice(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }
  const data = await prisma.invoice.create({
    data: {
      userId: session.user?.id,
      clientName: submission.value.clientName,
      clientEmail: submission.value.clientEmail,
      clientAddress: submission.value.clientAddress,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromName: submission.value.fromName,
      fromEmail: submission.value.fromEmail,
      fromAddress: submission.value.fromAddress,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      total: submission.value.total,
      status: submission.value.status,
      note: submission.value.note,
    },
  });

  const formattedDueDate = formatDueDate({
    invoiceDate: data.date,
    dueInDays: Number(data.dueDate),
  });

  await sendInvoiceEmail({
    recipientName: data.clientName,
    recipientEmail: data.clientEmail,
    invoiceNumber: String(data.invoiceNumber),
    dueDate: formattedDueDate,
    total: formatCurrency({
      amount: data.total,
      currency: data.currency as any,
    }),
    downloadUrl: `http://localhost:3000/api/invoice/${data.id}`,
  });

  return redirect("/dashboard/invoices");
}

export async function editInvoice(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }
  const data = await prisma.invoice.update({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id,
    },
    data: {
      clientName: submission.value.clientName,
      clientEmail: submission.value.clientEmail,
      clientAddress: submission.value.clientAddress,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromName: submission.value.fromName,
      fromEmail: submission.value.fromEmail,
      fromAddress: submission.value.fromAddress,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      total: submission.value.total,
      status: submission.value.status,
      note: submission.value.note,
    },
  });

  const formattedDueDate = formatDueDate({
    invoiceDate: data.date,
    dueInDays: Number(data.dueDate),
  });

  await sendInvoiceUpdateEmail({
    recipientName: data.clientName,
    recipientEmail: data.clientEmail,
    invoiceNumber: String(data.invoiceNumber),
    dueDate: formattedDueDate,
    total: formatCurrency({
      amount: data.total,
      currency: data.currency as any,
    }),
    downloadUrl: `http://localhost:3000/api/invoice/${data.id}`,
  });

  return redirect("/dashboard/invoices");
}

export async function DeleteInvoice(invoiceId: string) {
  const session = await requireUser();

  const data = await prisma.invoice.delete({
    where: {
      id: invoiceId,
      userId: session.user?.id,
    },
  });

  return redirect("/dashboard/invoices");
}

export async function MarkAsPaidAction(invoiceId: string) {
  const session = await requireUser();

  const data = await prisma.invoice.update({
    where: {
      id: invoiceId,
      userId: session.user?.id,
    },
    data: {
      status: "PAID",
    },
  });

  return redirect("/dashboard/invoices");
}

export async function updateUserProfile(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: userSettingsSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
    },
  });

  return redirect("/dashboard/settings");
}
