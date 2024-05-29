import { NextFunction, Request, Response } from "express";
import { z } from "zod";

/**
 * Middleware function to validate the request body against a given schema.
 * If the validation fails, it sends a 400 response with the validation errors.
 * If the validation succeeds, it calls the next middleware function.
 *
 * @param schema - The Zod schema to validate the request body against.
 * @returns A middleware function that handles the validation.
 */
export const validateBody = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const zodError = error as z.ZodError;
      res.status(400).json({
        message: "Validation failed. See details for specific errors.",
        errors: zodError.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
  };
};
