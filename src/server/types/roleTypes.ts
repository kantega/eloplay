export const RoleTexts = {
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  MEMBER: "MEMBER",
} as const;

export type RoleText = (typeof RoleTexts)[keyof typeof RoleTexts];
