import { prisma } from "@/app/utils/db";
import requireUser from "@/app/utils/hooks";
import EditInvoice from "@/components/custom/EditInvoice";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

async function getData(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

type Params = Promise<{ invoiceId: string }>;

export default async function EditInvoiceRoute({ params }: { params: Params }) {
  const { invoiceId } = await params;
  const session = await requireUser();
  const data = await getData(invoiceId, session.user?.id as string);
  return (
    <Suspense fallback={<Skeleton className="w-full h-full flex-1" />}>
      <EditInvoice data={data} />
    </Suspense>
  );
}
