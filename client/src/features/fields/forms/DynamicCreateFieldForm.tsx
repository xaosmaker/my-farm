"use client";
import dynamic from "next/dynamic";
import { Field } from "../types";
const CreateFieldForm = dynamic(() => import("./CreateFieldForm"), {
  ssr: false,
});

export default function DynamicCreateFieldForm({
  oldData,
}: {
  oldData?: Field;
}) {
  return <CreateFieldForm oldData={oldData} />;
}
