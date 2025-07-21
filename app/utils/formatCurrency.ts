interface FormatCurrencyProps {
  amount: number;
  currency: "USD" | "EUR" | "GBP";
  locale?: string; // Optional
}

export function formatCurrency({
  amount,
  currency,
  locale = "en-US",
}: FormatCurrencyProps) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}
