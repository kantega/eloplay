import { RoleTexts, type RoleText } from "@/server/types/roleTypes";

export const userIsModerator = (userRole: RoleText) => {
  return userRole === RoleTexts.ADMIN || userRole === RoleTexts.MODERATOR;
};
