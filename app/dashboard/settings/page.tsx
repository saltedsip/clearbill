import { prisma } from "@/app/utils/db";
import requireUser from "@/app/utils/hooks";
import SettingsForm from "@/components/custom/SettingsForm";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      address: true,
    },
  });

  if (!user) return null;

  return {
    ...user,
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    address: user.address ?? "",
  };
}

export default async function SettingsPage() {
  const session = await requireUser();
  const user = await getUserData(session.user?.id as string);

  if (!user) return notFound();

  return <SettingsForm user={user} />;
}
