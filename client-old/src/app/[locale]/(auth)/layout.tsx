import LocaleSwitcher from "@/components/LocaleSwitcher";
import ShowH1 from "@/components/ShowH1";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed flex h-24 w-full items-center justify-between bg-current/10 px-10">
        <ShowH1>My Farm</ShowH1>
        <LocaleSwitcher />
      </div>
      {children}
    </>
  );
}
