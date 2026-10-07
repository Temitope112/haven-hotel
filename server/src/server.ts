import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import roomRoutes from "./routes/room.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

const PORT =
  process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

/*
  Needed when deployed behind Render's proxy
  so Express can determine the client's IP
  correctly for rate limiting.
*/
app.set(
  "trust proxy",
  1,
);

/* SECURITY HEADERS */
app.use(
  helmet(),
);

/* CORS */
app.use(
  cors({
    origin(
      origin,
      callback,
    ) {
      /*
        Requests without an Origin header
        can come from tools such as Postman,
        health checks, or server-to-server
        requests.
      */
      if (!origin) {
        return callback(
          null,
          true,
        );
      }

      if (
        allowedOrigins.includes(
          origin,
        )
      ) {
        return callback(
          null,
          true,
        );
      }

      return callback(
        new Error(
          "Not allowed by CORS",
        ),
      );
    },

    credentials: true,
  }),
);

/* COOKIE SUPPORT */
app.use(
  cookieParser(),
);

/* REQUEST BODY */
app.use(
  express.json({
    limit: "1mb",
  }),
);

/*
  General API protection.

  Authentication endpoints also have
  their own stricter rate limiter
  inside auth.routes.ts.
*/
const apiLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit: 300,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many requests. Please try again later.",
    },
  });

app.use(
  "/api",
  apiLimiter,
);

/* ROUTES */
app.use(
  "/api/auth",
  authRoutes,
);

app.use(
  "/api/rooms",
  roomRoutes,
);

app.use(
  "/api/bookings",
  bookingRoutes,
);

app.use(
  "/api/admin",
  adminRoutes,
);

/* HEALTH CHECK */
app.get(
  "/",
  (
    req,
    res,
  ) => {
    return res.status(200).json({
      success: true,
      message:
        "Haven Hotel API is running.",
    });
  },
);

/* 404 */
app.use(
  (
    req,
    res,
  ) => {
    return res.status(404).json({
      success: false,
      message:
        "Route not found.",
    });
  },
);

/* GLOBAL ERROR HANDLER */
app.use(
  (
    error: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(
      "Unhandled error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  },
);

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT}`,
    );
  },
);