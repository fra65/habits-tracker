export interface LoginUserOutput {
  id: number | string;
  username: string | null;
  role: "USER" | "ADMIN" | "MODERATOR";
}