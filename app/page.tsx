import Hero from "@/components/custom/Hero";
import Navbar from "@/components/custom/Navbar";

export default function Home() {
  return (
    <main className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>
      <Navbar />
      <Hero />
    </main>
  );
}
