import { Ban, PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";

interface iAppProps {
  title: string;
  description: string;
  buttontext: string;
  href: string;
}

export default function EmptyState({
  title,
  description,
  buttontext,
  href,
}: iAppProps) {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border-2 border-dashed p-8 text-center animate-in fade-in">
      <div className="flex items-center justify-center size-20 rounded-full bg-primary/10">
        <Ban />
      </div>
      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="mb-8 mt-2 text-sm text-muted-foreground max-w-xm mx-auto text-center">
        {description}
      </p>
      <Link href={href} className={buttonVariants()}>
        <PlusCircle className="size-4 mr-2" />
        {buttontext}
      </Link>
    </div>
  );
}
