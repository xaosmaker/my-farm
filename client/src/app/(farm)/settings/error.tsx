"use client";

import GeneralPageError from "@/components/errorComponents/GeneralPageError";

export default function SettingsError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return <GeneralPageError error={error} title="Settings Error" />;
}
