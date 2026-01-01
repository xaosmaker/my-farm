import { z } from "zod/v4";

export const farmValidators = z.object({
  name: z.string().nonempty("This field is required"),
});

export type FarmFormData = z.infer<typeof farmValidators>;
