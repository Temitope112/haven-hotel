export type User = {
  id: number;
  name: string;
  email: string;
  role: "GUEST" | "ADMIN";
};

export type LoginResponse = {
  success: boolean;
  message?: string;
  token: string;
  user: User;
};

export type RegisterResponse = {
  success: boolean;
  message?: string;
  user: User;
};