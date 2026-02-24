"use client";
import H1 from "./H1";

export default function DetailPage({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <H1 className="col-span-full text-center">{title}</H1>
        {children}
      </div>
    </>
  );
}
