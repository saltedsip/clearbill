import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Graph from "./Graph";
import { prisma } from "@/app/utils/db";
import requireUser from "@/app/utils/hooks";
import { subDays, startOfDay, format } from "date-fns";

async function getInvoices(userId: string) {
  const rawData = await prisma.invoice.findMany({
    where: {
      status: "PAID",
      userId: userId,
      createdAt: {
        gte: startOfDay(subDays(new Date(), 30)),
        lte: new Date(),
      },
    },
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const aggregateData = rawData.reduce(
    (acc: { [key: string]: number }, curr) => {
      const date = format(new Date(curr.createdAt), "yyyy-MM-dd");
      acc[date] = (acc[date] || 0) + curr.total;
      return acc;
    },
    {}
  );

  const transformedData = Object.entries(aggregateData)
    .map(([date, amount]) => ({
      date,
      amount,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return transformedData;
}

export default async function InvoiceGraph() {
  const session = await requireUser();
  const data = await getInvoices(session.user?.id as string);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Paid Invoices</CardTitle>
        <CardDescription>
          Invoices that have been paid in the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Graph data={data} />
      </CardContent>
    </Card>
  );
}
