export const RoleTexts = {
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  MEMBER: "MEMBER",
  NOTMEMBER: "NOTMEMBER",
} as const;

export type RoleText = (typeof RoleTexts)[keyof typeof RoleTexts];
