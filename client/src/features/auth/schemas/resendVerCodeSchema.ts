import { z } from "zod/v4";

export const resendVerCodeSchema = z.object({
  email: z.email("invalid_email"),
});

export type ResendVerCodeSchema = z.infer<typeof resendVerCodeSchema>;
