import ShowH1 from "./ShowH1";

export default function ShowFieldPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <ShowH1>{title}</ShowH1>
      <div className="relative my-10 grid grid-cols-2 gap-2">{children}</div>
    </>
  );
}
