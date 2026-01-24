import { z } from "zod/v4";

export const seasonValidators = z.object({
  name: z.string().nullable(),
  startSeason: z.date("required_field"),
  finishSeason: z.date().optional(),
  // boundary: z.any(),
  areaInMeters: z
    .string()
    .refine((value) => value.match(/^\d+(\.\d+)?$/), {
      error: "invalid_number",
    })
    .refine((value) => parseFloat(value) > 0, {
      error: "invalid_min_number",
    }),
  fieldId: z.number(),
  crop: z.string("required_field").refine((item) => parseInt(item) > 0, {
    error: "required_field",
  }),
});

export type SeasonRequest = z.infer<typeof seasonValidators>;
