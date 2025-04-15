import { z } from "zod";

export const signupSchema= z.object({
    name: z.string(),
    email: z.string().email({"message":"Invalid email address"}),
    password: z.string().min(8, "Password must be at least 8 characters long").max(20, "Password must be at most 20 characters long"),
    confirmPassword: z.string(),
    }). refine((data)=> data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
});

export type SignupSchema = z.infer<typeof signupSchema>;