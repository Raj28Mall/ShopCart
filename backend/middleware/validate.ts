import { z, } from "zod";
import { Request, Response, NextFunction } from "express";
import { loginSchema, LoginSchema } from "../../schemas/loginSchema";

export const validate = (schema: LoginSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      loginSchema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.errors });
      }
      console.error("Validation error: ", err);
      return res.status(500).json({ message: "Validation error" });
    }
  };