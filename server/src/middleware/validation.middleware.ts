import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type {
  ZodType,
} from "zod";

export function validateBody(
  schema: ZodType,
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const result =
      schema.safeParse(
        req.body,
      );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid request data.",
        errors:
          result.error.issues.map(
            (issue) => ({
              field:
                issue.path.join(
                  ".",
                ),

              message:
                issue.message,
            }),
          ),
      });
    }

    /*
      Replace the original body
      with the validated and
      transformed Zod output.
    */
    req.body =
      result.data;

    next();
  };
}