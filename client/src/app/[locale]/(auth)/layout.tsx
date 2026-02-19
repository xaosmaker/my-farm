import LanguageToggle from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <header className="flex justify-between px-10 py-4 shadow-md dark:shadow-neutral-700/80">
        <Link href="/">
          <p className="text-4xl font-bold">My Farm</p>
        </Link>
        <div className="flex gap-2">
          <ThemeToggle />
          <LanguageToggle />
          <Button asChild className="bg-green-500 hover:bg-green-600">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </header>
      <section className="mt-10">{children}</section>
    </main>
  );
}
