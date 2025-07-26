import { MarkAsPaidAction } from "@/app/actions";
import { prisma } from "@/app/utils/db";
import requireUser from "@/app/utils/hooks";
import SubmitButton from "@/components/custom/SubmitButtons";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";
import MarkAsPaidGif from "@/public/MarkAsPaid.gif";
import Image from "next/image";

export async function Authorize(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
  });

  if (!data) {
    return redirect("/dashboard/invoices");
  }
}

type Params = Promise<{ invoiceId: string }>;

export default async function MarkAsPaid({ params }: { params: Params }) {
  const session = await requireUser();
  const { invoiceId } = await params;
  await Authorize(invoiceId, session.user?.id as string);
  return (
    <div className="flex flex-1 justify-center items-center">
      <Card className="w-full max-w-[500px]">
        <CardHeader>
          <CardTitle>Mark Invoice as Paid?</CardTitle>
          <CardDescription>
            Are you sure that you want to mark this invoice as paid?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image src={MarkAsPaidGif} className="w-full" alt="Warning" />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Link
            className={buttonVariants({ variant: "secondary" })}
            href="/dashboard/invoices"
          >
            Cancel
          </Link>
          <form
            action={async () => {
              "use server";

              await MarkAsPaidAction(invoiceId);
            }}
          >
            <SubmitButton text="Mark as paid" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
