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

  async function getExchangeRates() {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const json = await res.json();
    return json.rates; // like { EUR: 1.1, GBP: 1.3 }
  }

  const exchangeRates = await getExchangeRates();

  return (
    <StatsOverviewCards invoices={invoices} exchangeRates={exchangeRates} />
  );
}
