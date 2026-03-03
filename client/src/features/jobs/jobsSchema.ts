import { TFnError } from "@/types/TFnError";
import { z } from "zod/v4";
import { JOB_TYPES, JOB_TYPES_WITH_SUPPLIES } from "@/lib/globalData";

export const jobTypesEnum = z.enum(JOB_TYPES);

export const jobSupplySchema = (t: TFnError) =>
  z.object({
    quantity: z
      .string()
      .refine((value) => value.match(/^(\d+)(\.\d+)?$/), {
        error: t("invalid_number"),
      })
      .refine((value) => parseFloat(value) > 0, {
        error: t("invalid_min", { min: 0 }),
      }),
    supplyId: z
      .string()
      .refine((val) => parseInt(val) > 0, {
        error: t("required_generic"),
      }),
  });

export function jobSchema(t: TFnError) {
  return z
    .object({
      seasonId: z.number(),
      fieldId: z.number(),
      jobDate: z.date(t("required_generic")),
      description: z.string().optional(),
      jobType: jobTypesEnum.nullish(),

      areaInMeters: z
        .string()
        .refine((value) => value.match(/^(\d+)(\.\d+)?$/), {
          error: t("invalid_number"),
        })
        .refine((value) => parseFloat(value) > 0, {
          error: t("invalid_min", { min: 0 }),
        }),
      jobSupplies: z.array(jobSupplySchema(t)),
    })
    .superRefine((data, ctx) => {
      if (
        data.jobType &&
        JOB_TYPES_WITH_SUPPLIES.includes(data.jobType) &&
        data.jobSupplies.length === 0
      ) {
        ctx.addIssue({
          path: ["jobSupplies"],
          message: t("required_generic"),
          code: "custom",
        });
      }
    });
}

export type JobSchema = z.infer<ReturnType<typeof jobSchema>>;
export type JobSupplySchema = z.infer<ReturnType<typeof jobSupplySchema>>;
