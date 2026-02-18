"use client";
import { useTheme } from "next-themes";
import { Toaster, ToasterProps } from "sonner";

export default function ToasterWithTheme() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="top-right"
      theme={resolvedTheme as ToasterProps["theme"]}
      duration={3000}
      closeButton={true}
    />
  );
}
