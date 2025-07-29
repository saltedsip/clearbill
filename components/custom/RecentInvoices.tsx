import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { prisma } from "@/app/utils/db";
import requireUser from "@/app/utils/hooks";
import formatCurrency from "@/app/utils/formatCurrency";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      clientName: true,
      clientEmail: true,
      total: true,
      currency: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  });
  return data;
}

export default async function RecentInvoices() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        {data.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-2">
            <Avatar className="hidden sm:flex size-9">
              <AvatarFallback>{item.clientName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leadin-none">
                {item.clientName}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.clientEmail}
              </p>
            </div>
            <p className="ml-auto font-medium text-sm">
              {formatCurrency({
                amount: item.total,
                currency: item.currency,
              })}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
