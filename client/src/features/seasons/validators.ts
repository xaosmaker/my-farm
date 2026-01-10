import { z } from "zod/v4";

export const seasonValidators = z.object({
  name: z.string().nullable(),
  startSeason: z.date("Αυτό το πεδίο είναι υποχρεωτικό"),
  finishSeason: z.date().optional(),
  // boundary: z.any(),
  areaInMeters: z
    .string()
    .refine((value) => value.match(/^\d+(\.\d+)?$/), {
      error: "Required and use . for decimal",
    })
    .refine((value) => parseFloat(value) > 0, {
      error: "Should be greater than 0",
    }),
  fieldId: z.number(),
  crop: z
    .string("Αυτό το πεδίο είναι υποχρεωτικό")
    .refine((item) => parseInt(item) > 0, {
      error: "Αυτό το πεδίο είναι υποχρεωτικό",
    }),
});

export type SeasonRequest = z.infer<typeof seasonValidators>;
