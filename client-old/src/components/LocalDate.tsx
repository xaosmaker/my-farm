import dynamic from "next/dynamic";

function LocalDate({ date }: { date: string }) {
  return <div>{new Date(date).toLocaleDateString()}</div>;
}

export default dynamic(() => Promise.resolve(LocalDate), { ssr: false });
