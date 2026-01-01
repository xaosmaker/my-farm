import { z } from "zod/v4";
import {
  JOB_TYPES,
  JOB_TYPES_WITH_SUPPLIES,
  JobTypesWithSupplies,
} from "./types";

export const JobTypesEnum = z.enum(JOB_TYPES);

export const jobSuppliesValidator = z.object({
  quantity: z.number().positive("Quantity must be > 0"),
  supplyId: z
    .string()
    .refine((val) => parseInt(val) > 0, { error: "supply ID must be > 0" }),
});

export const jobValidator = z
  .object({
    fieldId: z.number().positive(),
    jobDate: z.date(),
    description: z.string(),
    jobType: JobTypesEnum.nullish(),
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
