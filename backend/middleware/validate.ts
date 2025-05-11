import { z, } from "zod";
import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from 'zod';
import { loginSchema, LoginSchema } from "../../schemas/loginSchema";

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ errors: err.errors });
        return;
      }
      console.error("Internal server error during validation: ", err);
      res.status(500).json({ message: "Internal server error during validation" });
      return;
    }
  };