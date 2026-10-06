import type {
  NextFunction,
  Request,
  Response,
} from "express";
import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: number;
  role: "GUEST" | "ADMIN";
};

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });
  }

  const [scheme, token] =
    authHeader.split(" ");

  if (
    scheme !== "Bearer" ||
    !token
  ) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid authentication format.",
    });
  }

  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    console.error(
      "JWT_SECRET is not configured.",
    );

    return res.status(500).json({
      success: false,
      message:
        "Server configuration error.",
    });
  }

  try {
    const decoded =
      jwt.verify(
        token,
        secret,
      ) as JwtPayload;

    if (
      !decoded.userId ||
      !decoded.role
    ) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Invalid authentication token.",
        });
    }

    req.user = {
      userId:
        decoded.userId,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message:
        "Session expired or invalid.",
    });
  }
}