"use client";

import { useMemo, useState, useEffect } from "react";
import { TrendingUp, FileText, Banknote, Clock } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { formatCurrency } from "@/app/utils/formatCurrency";

interface Invoice {
  total: number;
  status: string;
  currency: string;
  date: string | Date;
}

interface StatsOverviewCardsProps {
  invoices: Invoice[];
  exchangeRates: Record<string, number>; // Example: { USD: 1, EUR: 1.12, GBP: 1.3 }
}

export function StatsOverviewCards({
  invoices,
  exchangeRates,
}: StatsOverviewCardsProps) {
  const allowedCurrencies = ["USD", "EUR", "GBP"] as const;
  type AllowedCurrency = (typeof allowedCurrencies)[number];

  function isAllowedCurrency(val: string): val is AllowedCurrency {
    return allowedCurrencies.includes(val as AllowedCurrency);
  }

  const currencyOptions = useMemo(() => {
    const set = new Set(invoices.map((inv) => inv.currency));
    return ["ALL", ...Array.from(set)];
  }, [invoices]);

  const [currency, setCurrency] = useState(currencyOptions[0] ?? "ALL");

  useEffect(() => {
    if (!currencyOptions.includes(currency)) {
      setCurrency(currencyOptions[0] ?? "ALL");
    }
  }, [currencyOptions, currency]);

  const filtered = useMemo(() => {
    if (currency === "ALL") return invoices;
    return invoices.filter((inv) => inv.currency === currency);
  }, [invoices, currency]);

  const totalRevenue = useMemo(() => {
    if (currency === "ALL") {
      return invoices.reduce((acc, i) => {
        const rate = exchangeRates[i.currency] ?? 1;
        return acc + i.total * rate;
      }, 0);
    } else {
      return filtered.reduce((acc, i) => acc + i.total, 0);
    }
  }, [currency, invoices, filtered, exchangeRates]);

  const totalInvoices = filtered.length;
  const paidInvoices = filtered.filter((i) => i.status === "PAID").length;
  const openInvoices = filtered.filter((i) => i.status === "PENDING").length;

  const displayCurrency: AllowedCurrency =
    currency === "ALL" ? "USD" : isAllowedCurrency(currency) ? currency : "USD"; // fallback for unsupported currency

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency({
        amount: totalRevenue,
        currency: displayCurrency,
      }),
      footer:
        currency === "ALL"
          ? "Revenue in USD (converted)"
          : "Revenue from this currency",
      icon: <TrendingUp className="size-4" />,
    },
    {
      title: "Total Invoices",
      value: `${totalInvoices}`,
      footer: "Total number of invoices",
      icon: <FileText className="size-4" />,
    },
    {
      title: "Paid Invoices",
      value: `${paidInvoices}`,
      footer: "Total invoices that have been paid",
      icon: <Banknote className="size-4" />,
    },
    {
      title: "Pending Invoices",
      value: `${openInvoices}`,
      footer: "Invoices that are currently pending",
      icon: <Clock className="size-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="col-span-full flex justify-end mb-2">
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {currencyOptions.map((curr) => (
              <SelectItem key={curr} value={curr}>
                {curr === "ALL" ? "All Currencies" : curr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-sm">
          <CardHeader className="flex justify-between space-y-0 mb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">{stat.value}</h2>
            <p className="text-xs text-muted-foreground">{stat.footer}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
