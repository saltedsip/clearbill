import { prisma } from "@/app/utils/db";
import requireUser from "@/app/utils/hooks";
import { StatsOverviewCards } from "@/components/custom/StatsOverviewCards";

export default async function DashboardBlocks() {
  const session = await requireUser();
  const userId = session.user?.id as string;

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    select: {
      total: true,
      status: true,
      currency: true,
      date: true,
    },
  });

  return <StatsOverviewCards invoices={invoices} />;
}
