"use server";

import { baseFetch } from "@/lib/baseFetch";
import { serverErrorDTO } from "@/lib/serverErrorDTO";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJobAction(
  _previousState: unknown,
  formData: unknown,
) {
  if (typeof formData !== "object" || !formData) {
    return;
  }

  const data = formData as {
    seasonId?: number;
    fieldId?: number;
    jobDate?: Date;
    description?: string;
    jobType?: string;
    areaInMeters?: string;
    jobSupplies?: Array<{ quantity: string; supplyId: string }>;
  };

  if (!data.areaInMeters) {
    return;
  }

  const sendData = {
    seasonId: data.seasonId,
    fieldId: data.fieldId,
    jobDate: data.jobDate?.toISOString(),
    description: data.description || null,
    jobType: data.jobType,
    areaInMeters: parseFloat(data.areaInMeters),
    jobSupplies: data.jobSupplies?.map((s) => ({
      quantity: parseFloat(s.quantity),
      supplyId: parseInt(s.supplyId),
    })),
  };

  const res = await baseFetch({
    path: "/api/jobs",
    method: "POST",
    body: sendData,
  });

  if (res.ok) {
    revalidatePath("/seasons");
    return redirect(`/seasons/${data.seasonId}`);
  }

  const t = await getTranslations("Global.Error");
  const resData = await res.json();
  return { success: false, errors: serverErrorDTO(resData, t) };
}

export async function deleteJobAction(
  _prevState: unknown,
  jobId: string,
) {
  const res = await baseFetch({
    path: `/api/jobs/${jobId}`,
    method: "DELETE",
    body: undefined,
  });
  if (res.ok) {
    revalidatePath("/seasons");
    return { success: true, errors: undefined };
  }
  const t = await getTranslations("Global.Error");
  const data = await res.json();
  return { success: false, errors: serverErrorDTO(data, t) };
}
