import type {
  NextFunction,
  Request,
  Response,
} from "express";

const SAFE_METHODS = [
  "GET",
  "HEAD",
  "OPTIONS",
];

export function csrfProtection(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (
    SAFE_METHODS.includes(
      req.method,
    )
  ) {
    return next();
  }

  const csrfHeader =
    req.headers[
      "x-csrf-token"
    ];

  const expectedToken =
    res.locals
      .csrfToken;

  if (
    typeof csrfHeader !==
      "string" ||
    !expectedToken ||
    csrfHeader !==
      expectedToken
  ) {
    return res.status(403).json({
      success: false,
      message:
        "Invalid CSRF token.",
    });
  }

  next();
}