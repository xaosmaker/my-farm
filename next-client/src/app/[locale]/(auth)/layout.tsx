import LanguageToggle from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

export default function UnauthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <header className="flex justify-between px-10 py-4">
        <p className="text-4xl">My Farm</p>
        <div className="flex gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </header>
      <section>{children}</section>
    </main>
  );
}
