import { z } from "zod/v4";

export const loginValidate = z.object({
  email: z.email("invalid_email"),
  password: z.string().nonempty("required_password"),
});

export const emailValidator = z.object({
  email: z.email("invalid_email"),
});

export const registerValidate = z
  .object({
    email: z.email("invalid_email"),
    password: z
      .string()
      .refine((data) => /[A-Z]/.test(data), "invalid_password_cap_letter")
      .refine((data) => /[1-9]/.test(data), "invalid_password_number")
      .min(8, { error: "invalid_password_length" }),

    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password != data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "invalid_password_mismatch",
        code: "custom",
      });
    }
  });

export type LoginFormData = z.infer<typeof loginValidate>;
export type RegFormData = z.infer<typeof registerValidate>;
export type EmailFormData = z.infer<typeof emailValidator>;
