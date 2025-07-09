export interface LoginUserOutput {
  id: number | string;
  username: string;
  role: "USER" | "ADMIN" | "MODERATOR";
}