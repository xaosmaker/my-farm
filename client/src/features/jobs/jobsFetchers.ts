import { baseFetch } from "@/lib/baseFetch";
import { Job } from "./types";

export async function getJobs(seasonId: string): Promise<Job[]> {
  const res = await baseFetch({
    path: `/api/jobs/${seasonId}`,
    method: "GET",
    body: undefined,
  });

  if (res.ok) {
    const data: Job[] = await res.json();
    return data;
  }

  return [];
}
