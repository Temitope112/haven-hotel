export type UserRole =
  | "GUEST"
  | "ADMIN";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
};

export type CurrentUserResponse = {
  success: boolean;
  user: User;
};