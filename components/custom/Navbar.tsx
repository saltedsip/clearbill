import React from "react";
import Logo from "@/public/logo.png";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "../ui/button";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between py-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt="Logo" className="size-10" />
        <p className="text-2xl font-bold">Clearbill</p>
      </Link>
      <Link href="/login" className={buttonVariants()}>
        Get Started
      </Link>
    </div>
  );
}
