import { z } from "zod/v4";

export const loginValidate = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().nonempty("This Field is required"),
});

export const emailValidator = z.object({
  email: z.email("Enter a valid email"),
});
export const registerValidate = z
  .object({
    email: z.email("Enter a valid email"),
    password: z
      .string()
      .refine(
        (data) => /[A-Z]/.test(data),
        "Password should contain one Cappital letter",
      )
      .refine(
        (data) => /[1-9]/.test(data),
        "Password should contain one number",
      )
      .min(8, "Password should be 8 or more chars"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password != data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords mismatch",
        code: "custom",
      });
    }
  });

export type LoginFormData = z.infer<typeof loginValidate>;
export type RegFormData = z.infer<typeof registerValidate>;
export type EmailFormData = z.infer<typeof emailValidator>;
