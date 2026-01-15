"use client";
import dynamic from "next/dynamic";

function NoSSRWrapper({ children }: { children: React.ReactElement }) {
  return children;
}

export default dynamic(() => Promise.resolve(NoSSRWrapper), { ssr: false });
