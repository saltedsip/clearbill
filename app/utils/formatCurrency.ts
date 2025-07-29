import type { Currency } from "@prisma/client";

interface FormatCurrencyProps {
  amount: number;
  currency: Currency;
  locale?: string;
}

export default function formatCurrency({
  amount,
  currency,
  locale = "en-US",
}: FormatCurrencyProps) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}
