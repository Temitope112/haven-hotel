import "dotenv/config";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn(
    "RESEND_API_KEY is not configured. Password reset emails will not work."
  );
}

const resend = new Resend(apiKey);

type SendPasswordResetEmailOptions = {
  to: string;
  name: string;
  resetUrl: string;
};

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: SendPasswordResetEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const from =
    process.env.RESET_EMAIL_FROM ||
    "Haven Hotel <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Reset your Haven Hotel password",

    html: `
      <!doctype html>
      <html>
        <body
          style="
            margin:0;
            padding:0;
            background:#151613;
            color:#f5f1e8;
            font-family:Arial,Helvetica,sans-serif;
          "
        >
          <div
            style="
              max-width:600px;
              margin:0 auto;
              padding:48px 24px;
            "
          >
            <div
              style="
                border:1px solid rgba(255,255,255,0.1);
                border-radius:24px;
                padding:40px;
                background:#1c1d19;
              "
            >
              <p
                style="
                  margin:0 0 24px;
                  color:#c9b58d;
                  font-size:11px;
                  text-transform:uppercase;
                  letter-spacing:0.2em;
                "
              >
                Haven Hotel
              </p>

              <h1
                style="
                  margin:0;
                  color:#f5f1e8;
                  font-size:32px;
                  line-height:1.1;
                "
              >
                Reset your password
              </h1>

              <p
                style="
                  margin:24px 0 0;
                  color:rgba(245,241,232,0.65);
                  font-size:15px;
                  line-height:1.7;
                "
              >
                Hello ${name},
              </p>

              <p
                style="
                  color:rgba(245,241,232,0.65);
                  font-size:15px;
                  line-height:1.7;
                "
              >
                We received a request to reset the password for your
                Haven account.
              </p>

              <a
                href="${resetUrl}"
                style="
                  display:inline-block;
                  margin-top:20px;
                  padding:14px 22px;
                  border-radius:999px;
                  background:#f5f1e8;
                  color:#171714;
                  text-decoration:none;
                  font-size:14px;
                  font-weight:600;
                "
              >
                Reset password
              </a>

              <p
                style="
                  margin-top:30px;
                  color:rgba(245,241,232,0.4);
                  font-size:13px;
                  line-height:1.7;
                "
              >
                This link expires in 30 minutes.
                If you didn't request a password reset, you can ignore
                this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    throw new Error(
      error.message || "Unable to send password reset email."
    );
  }
}