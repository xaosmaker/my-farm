import { Pencil } from "lucide-react";
import Link from "next/link";

export default function EditItem({ url }: { url: string }) {
  return (
    <Link href={url} className="flex gap-2 rounded-xl p-2 hover:bg-current/10">
      <Pencil /> Επεξεργασία
    </Link>
  );
}
