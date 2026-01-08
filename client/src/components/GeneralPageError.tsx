"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function GeneralPageError({ title }: { title: string }) {
  const router = useRouter();
  return (
    <div className="text-center">
      <h1 className="pt-5 text-3xl font-bold text-red-500">{title}</h1>
      <p className="pt-4 pb-4">Something went wrong try to refresh the page</p>
      <Button onClick={() => router.refresh()}>Refresh Page</Button>
      <p className="pt-4">If the error persist contact the admin</p>
    </div>
  );
}
