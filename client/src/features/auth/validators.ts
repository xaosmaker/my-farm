import { z } from "zod/v4";

export const loginValidate = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().nonempty("This Field is required"),
});

export type LoginFormData = z.infer<typeof loginValidate>;
