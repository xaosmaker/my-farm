import { baseFetch } from "@/lib/baseFetch";
import { Job } from "./types";
import { getLocale, getTranslations } from "next-intl/server";
import { Messages } from "next-intl";

export async function getJobs(
  seasonId: string,
  translate: boolean = false,
  timezone: string | undefined = undefined,
): Promise<Job[]> {
  const res = await baseFetch({
    path: `/api/jobs/${seasonId}`,
    method: "GET",
    body: undefined,
  });

  if (res.ok) {
    const data: Job[] = await res.json();
    if (translate) {
      if (!timezone) {
        throw new Error("Timezone required on translation");
      }
      const locale = await getLocale();
      const t = await getTranslations("Jobs.Job");
      data.map((d) => {
        d.jobDate = new Date(d.jobDate).toLocaleDateString(locale, {
          timeZone: timezone,
        });
        d.jobType = t(d.jobType as keyof Messages["Jobs"]["Job"]);
        return d;
      });
    }
    return data;
  }

  return [];
}
