export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: "GUEST" | "ADMIN";
      };
    }
  }
}