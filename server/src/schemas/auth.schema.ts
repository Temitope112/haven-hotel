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

  export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(1, "Reset token is required."),

  password: z
    .string()
    .min(
      8,
      "Password must be at least 8 characters."
    )
    .max(
      72,
      "Password cannot exceed 72 characters."
    )
    .regex(
      /[A-Z]/,
      "Password must contain an uppercase letter."
    )
    .regex(
      /[a-z]/,
      "Password must contain a lowercase letter."
    )
    .regex(
      /\d/,
      "Password must contain a number."
    ),
});

export const updateProfileSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Name must be at least 2 characters.",
      )
      .max(
        100,
        "Name cannot exceed 100 characters.",
      ),
  });
  export const changePasswordSchema =
  z.object({
    currentPassword: z
      .string()
      .min(
        1,
        "Current password is required.",
      ),

    newPassword: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters.",
      )
      .max(
        72,
        "Password cannot exceed 72 characters.",
      )
      .regex(
        /[A-Z]/,
        "Password must contain an uppercase letter.",
      )
      .regex(
        /[a-z]/,
        "Password must contain a lowercase letter.",
      )
      .regex(
        /\d/,
        "Password must contain a number.",
      ),
  });