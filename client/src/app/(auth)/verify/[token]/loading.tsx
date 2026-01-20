import { Loader2 } from "lucide-react";

export default function VerifyLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Loader2 className="h-20 w-20 animate-spin" />
    </div>
  );
}
