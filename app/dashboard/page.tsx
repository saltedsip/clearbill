import DashboardBlocks from "@/components/custom/DashboardBlocks";
import requireUser from "../utils/hooks";
import InvoiceGraph from "@/components/custom/InvoiceGraph";
import RecentInvoices from "@/components/custom/RecentInvoices";
import { prisma } from "../utils/db";
import EmptyState from "@/components/custom/EmptyState";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
    },
  });
  return data;
}

export default async function DashboardRoute() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  return (
    <>
      {data.length < 1 ? (
        <EmptyState
          title="No invoices found"
          description="Create an invoice to see it right here"
          buttontext="Create Invoice"
          href="/dashboard/invoices/create"
        />
      ) : (
        <>
          <DashboardBlocks />
          <div className="grid gap-4 lg:grid-cols-3">
            <InvoiceGraph />
            <RecentInvoices />
          </div>
        </>
      )}
    </>
  );
}
