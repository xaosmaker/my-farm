"use server";

import { baseRequest } from "@/lib/baseRequest";
import { JobFormData } from "../jobValidators";
import { SERVER_URL } from "@/lib/serverUrl";
import { redirect } from "next/navigation";
import { toResponseError } from "@/lib/responseError";

interface JobRequest {
  fieldId: number;
  jobType: string;
  description: string;
  jobDate: string;
  areaInMeters: number;
  seasonId: number;
  jobSupplies: JobSupplies[];
}

type JobSupplies = {
  quantity: number;
  supplyId: number;
};
export async function deleteJobAction(
  _prevState: unknown,
  jobId: string | number,
) {
  const res = await baseRequest({
    url: `${SERVER_URL}/api/jobs/${jobId}`,
    method: "DELETE",
    body: undefined,
  });
  if (res.ok) {
    redirect("/seasons");
  }
  return undefined;
}

export async function createJobAction(_prevState: unknown, data: JobFormData) {
  const sendData: JobRequest = {
    fieldId: data.fieldId,
    seasonId: data.seasonId,
    jobDate: data.jobDate.toISOString(),
    areaInMeters: parseFloat(data.areaInMeters),
    description: data.description,
    jobType: data.jobType as string,
    jobSupplies: [],
  };
  for (let i = 0; i < data.jobSupplies.length; i++) {
    sendData.jobSupplies.push({
      quantity: parseFloat(data.jobSupplies[i].quantity),
      supplyId: parseInt(data.jobSupplies[i].supplyId),
    });
  }
  const res = await baseRequest({
    url: `${SERVER_URL}/api/jobs`,
    method: "POST",
    body: JSON.stringify(sendData),
  });

  if (res.ok) {
    redirect(`/fields/${sendData.fieldId}/seasons/${sendData.seasonId}`);
  }
  const resdata = await res.json();
  return toResponseError(resdata);
}
