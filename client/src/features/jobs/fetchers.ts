import { baseRequest } from "@/lib/baseRequest";
import { SERVER_URL } from "@/lib/serverUrl";
import type { Job } from "@/features/jobs/types";

export async function GetAllJobs(fieldId: string): Promise<Job[]> {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/jobs/${fieldId}`,
    method: "GET",
    body: undefined,
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  return [];
}
