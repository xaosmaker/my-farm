"use client";

import GeneralPageError from "@/components/errorComponents/GeneralPageError";

export default function FieldsError({ error }: { error: Error }) {
  return (
    <>
      <GeneralPageError error={error} title="Fields Error" />
    </>
  );
}
