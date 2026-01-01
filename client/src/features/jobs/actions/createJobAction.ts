"use server";

import { baseRequest } from "@/lib/baseRequest";
import { JobFormData } from "../jobValidators";
import { JOB_TYPES_WITH_SUPPLIES, JobTypesWithSupplies } from "../types";
import { SERVER_URL } from "@/lib/serverUrl";
import { redirect } from "next/navigation";

interface JobRequest {
  fieldId: number;
  jobDate: string;
  description: string;
  jobType: string;
  jobSupplies: JobSupplies[];
}

type JobSupplies = {
  quantity: number;
  supplyId: number;
};

export async function createJobAction(
  _prevState: undefined,
  data: JobFormData,
) {
  const sendData: JobRequest = {
    fieldId: data.fieldId,
    jobDate: data.jobDate.toISOString(),
    description: data.description,
    jobType: data.jobType as string,
    jobSupplies: [],
  };
  if (JOB_TYPES_WITH_SUPPLIES.includes(data.jobType as JobTypesWithSupplies)) {
    for (let i = 0; i < data.jobSupplies.length; i++) {
      sendData.jobSupplies.push({
        quantity: data.jobSupplies[i].quantity,
        supplyId: parseInt(data.jobSupplies[i].supplyId),
      });
    }
  } else {
    sendData.jobSupplies = [];
  }
  const res = await baseRequest({
    url: `${SERVER_URL}/api/jobs`,
    method: "POST",
    body: JSON.stringify(sendData),
  });
  if (res.ok) {
    redirect("/fields");
  }
  return undefined;
}
