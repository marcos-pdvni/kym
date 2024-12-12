import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be no more than 32 characters long"),
});

export const signupSchema = z
  .object({
    name: z.string().min(3).max(16),
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(32, "Password must be no more than 32 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match.",
  });

export const newWalletSchema = z.object({
  title: z.string().min(5),
  value: z.preprocess((v) => {
    if (typeof v === "string") {
      const trimmed = v.trim();
      if (!isNaN(Number(trimmed))) {
        return Number(trimmed);
      }
    }

    return v;
  }, z.number().min(0, "Must be a positive number").optional()),
});
