import { z } from "zod/v4";
import { JobTypesWithSupplies } from "./types";
import { JOB_TYPES, JOB_TYPES_WITH_SUPPLIES } from "@/types/sharedTypes";

export const JobTypesEnum = z.enum(JOB_TYPES);

export const jobSuppliesValidator = z.object({
  quantity: z
    .string()
    .refine((value) => value.match(/^\d+(\.\d+)?$/), {
      error: "Required and use . for decimal",
    })
    .refine((value) => parseFloat(value) > 0, {
      error: "Should be greater than 0",
    }),
  quantityPerUnit: z
    .string()
    .refine((value) => value.match(/^\d+(\.\d+)?$/), {
      error: "Required and use . for decimal",
    })
    .refine((value) => parseFloat(value) > 0, {
      error: "Should be greater than 0",
    }),

  supplyId: z
    .string()
    .refine((val) => parseInt(val) > 0, { error: "select a supply" }),
});

export const jobValidator = z
  .object({
    seasonId: z.number().positive(),
    fieldId: z.number().positive(),
    jobDate: z.date(),
    description: z.string(),
    jobType: JobTypesEnum.nullish(),

    areaInMeters: z
      .string()
      .refine((value) => value.match(/^\d+(\.\d+)?$/), {
        error: "Required and use . for decimal",
      })
      .refine((value) => parseFloat(value) > 0, {
        error: "Should be greater than 0",
      }),
    jobSupplies: z.array(jobSuppliesValidator),
  })
  .superRefine((data, ctx) => {
    const requiredSupplies = JOB_TYPES_WITH_SUPPLIES.includes(
      data.jobType as JobTypesWithSupplies,
    );
    if (requiredSupplies && data.jobSupplies.length === 0) {
      ctx.addIssue({
        path: ["jobSupplies"],
        message: "Supplies are required for this jobType",
        code: "custom",
      });
    }
  });
// schema.ts

export type JobFormData = z.infer<typeof jobValidator>;
export type JobSuppliesFormData = z.infer<typeof jobSuppliesValidator>;
