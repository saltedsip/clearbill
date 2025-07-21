"use client";

import { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Banknote,
  Clock,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Invoice {
  total: number;
  status: string;
  currency: string;
  date: string | Date;
}

export function StatsOverviewCards({ invoices }: { invoices: Invoice[] }) {
  const [currency, setCurrency] = useState("All");

  const currencyOptions = useMemo(() => {
    const set = new Set(invoices.map((inv) => inv.currency));
    return ["All", ...Array.from(set)];
  }, [invoices]);

  const filtered = useMemo(() => {
    return currency === "All"
      ? invoices
      : invoices.filter((inv) => inv.currency === currency);
  }, [invoices, currency]);

  const totalRevenue = filtered.reduce((acc, i) => acc + i.total, 0);
  const totalInvoices = filtered.length;
  const paidInvoices = filtered.filter((i) => i.status === "PAID").length;
  const openInvoices = filtered.filter((i) => i.status === "PENDING").length;

  const stats = [
    {
      title: "Total Revenue",
      value: `${totalRevenue.toLocaleString()} ${currency}`,
      description: "Revenue across all invoices",
      icon: <TrendingUp className="size-4" />,
      badge: "+12.5%",
      trend: "up",
      color: "from-green-100 to-white",
    },
    {
      title: "Invoices",
      value: `${totalInvoices}`,
      description: "Total number of invoices",
      icon: <FileText className="size-4" />,
      badge: "+3.2%",
      trend: "up",
      color: "from-blue-100 to-white",
    },
    {
      title: "Paid Invoices",
      value: `${paidInvoices}`,
      description: "Payments completed",
      icon: <Banknote className="size-4" />,
      badge: "+8.1%",
      trend: "up",
      color: "from-emerald-100 to-white",
    },
    {
      title: "Open Invoices",
      value: `${openInvoices}`,
      description: "Pending payments",
      icon: <Clock className="size-4" />,
      badge: "-5%",
      trend: "down",
      color: "from-red-100 to-white",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <div className="col-span-full flex justify-end mb-2">
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {currencyOptions.map((curr) => (
              <SelectItem key={curr} value={curr}>
                {curr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {stats.map((stat) => (
        <Card
          key={stat.title}
          className={`@container/card bg-gradient-to-t ${stat.color} shadow-sm`}
          data-slot="card"
        >
          <CardHeader>
            <CardDescription>{stat.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stat.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {stat.trend === "up" ? <TrendingUp /> : <TrendingDown />}
                {stat.badge}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium space-y-0">
              {stat.description} {stat.icon}
            </div>
            <div className="text-muted-foreground">
              {stat.trend === "up" ? "Trending up" : "Trending down"} this
              period
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
