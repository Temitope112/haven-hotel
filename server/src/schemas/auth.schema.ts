import {
  z,
} from "zod";

const emailSchema =
  z
    .string({
      message:
        "Email is required.",
    })
    .trim()
    .email(
      "Please enter a valid email address.",
    )
    .toLowerCase();

const passwordSchema =
  z
    .string({
      message:
        "Password is required.",
    })
    .min(
      8,
      "Password must be at least 8 characters long.",
    )
    .max(
      72,
      "Password must not exceed 72 characters.",
    )
    .regex(
      /[A-Z]/,
      "Password must contain at least one uppercase letter.",
    )
    .regex(
      /[a-z]/,
      "Password must contain at least one lowercase letter.",
    )
    .regex(
      /\d/,
      "Password must contain at least one number.",
    );

export const registerSchema =
  z.object({
    name:
      z
        .string({
          message:
            "Name is required.",
        })
        .trim()
        .min(
          2,
          "Name must be at least 2 characters long.",
        )
        .max(
          100,
          "Name must not exceed 100 characters.",
        ),

    email:
      emailSchema,

    password:
      passwordSchema,
  });

export const loginSchema =
  z.object({
    email:
      emailSchema,

    /*
      Don't apply registration-strength
      rules during login.

      Existing accounts may have been
      created under older password rules.
    */
    password:
      z
        .string({
          message:
            "Password is required.",
        })
        .min(
          1,
          "Password is required.",
        )
        .max(
          72,
          "Invalid email or password.",
        ),
  });