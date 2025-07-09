const validRoles = ["USER", "ADMIN", "MODERATOR"] as const;
type Role = (typeof validRoles)[number];

export function normalizeRole(role: unknown): Role | undefined {
  if (typeof role === "string" && validRoles.includes(role as Role)) {
    return role as Role;
  }
  return undefined; // oppure "USER" come default se vuoi
}
