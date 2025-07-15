interface FormatDueDateProps {
  invoiceDate: string | Date;
  dueInDays: number;
}

export function formatDueDate({
  invoiceDate,
  dueInDays,
}: FormatDueDateProps): string {
  const invoiceDateObj = new Date(invoiceDate);
  const dueDateObj = new Date(
    invoiceDateObj.getTime() + dueInDays * 24 * 60 * 60 * 1000
  );

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(dueDateObj);
}
