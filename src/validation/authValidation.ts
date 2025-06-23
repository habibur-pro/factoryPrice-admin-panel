import { z } from "zod";

export const signinSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email formate"),
  password: z.string({ required_error: "Password is required" }),
});

export const socialSigninSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email formate"),
});
export const signupOtpSchema = z.object({
  otp: z.string({ required_error: "Email is required" }).min(6),
});
export const signupNameSchema = z.object({
  country: z.string({ required_error: "Name is required" }).min(1),
  firstName: z.string({ required_error: "Name is required" }).min(1),
  lastName: z.string().optional(),
  password: z.string({ required_error: "Password is required" }).min(6),
  phoneNumber: z.string({ required_error: "Phone number is required" }).min(1),
});
