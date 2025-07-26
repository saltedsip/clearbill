import Link from "next/link";
import React from "react";
import { RainbowButton } from "../magicui/rainbow-button";

export default function Hero() {
  return (
    <section className="relative h-[85vh] flex flex-col items-center justify-center py-12 lg:py-20">
      <div className="text-center">
        <span className="text-sm text-primary font-medium tracking-tight bg-primary/10 px-4 py-2 rounded-full">
          Introducing Clearbill
        </span>
        <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-tighter">
          Invoicing made
          <span className="block -mt-2 bg-gradient-to-l from-blue-500 via-teal-500 to-green-500 text-transparent bg-clip-text">
            super easy!
          </span>
        </h1>
        <p className="max-w-xl mx-auto mt-20 lg:text-lg text-muted-foreground">
          Creating invoices can be a pain!
          <span className="block">
            Clearbill makes it easy for you to get paid on time!
          </span>
        </p>
        <div className="mt-7 mb-12">
          <Link href="/login">
            <RainbowButton>Get Started</RainbowButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
