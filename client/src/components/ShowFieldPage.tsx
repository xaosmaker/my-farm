export default function ShowFieldPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <h1 className="text-center text-2xl">{title}</h1>
      <div className="relative my-10 grid grid-cols-2 gap-2">{children}</div>
    </>
  );
}
