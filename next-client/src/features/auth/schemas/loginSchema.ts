import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("email Error"),
  password: z.string().min(1, { error: "password Error" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
