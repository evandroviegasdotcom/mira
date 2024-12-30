import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center py-12">
        <Link className="flex items-center justify-center" href="#">
          <Image
            src="/logo.png"
            width="40"
            height="40"
            alt="Mira logo"
            className="rounded-lg"
          />
          <span className="ml-2 text-2xl font-bold">Mira</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6 font-medium">
          <Link className="text-sm hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm hover:underline underline-offset-4" href="#">
            Contact
          </Link>
          <Button>
          <Link href="/app">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className=" px-4 md:px-6 ">
            <div className="flex flex-col items-center space-y-4 text-center ">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Organize Your Life with Mira
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Mira is the advanced organization app that helps you
                  streamline your tasks, projects, and life. Stay on top of
                  everything with ease.
                </p>
              </div>
              <div className="space-x-4">
              <Button>
          <Link href="/app">Get Started</Link>
          </Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
