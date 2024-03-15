import { RoleTexts, type RoleText } from "@/server/types/roleTypes";

export const userIsAdmin = (userRole: RoleText) => {
  return userRole === RoleTexts.ADMIN;
};

export const userIsModerator = (userRole: RoleText) => {
  return userRole === RoleTexts.ADMIN || userRole === RoleTexts.MODERATOR;
};

export const userIsMember = (userRole: RoleText) => {
  return (
    userRole === RoleTexts.ADMIN ||
    userRole === RoleTexts.MODERATOR ||
    userRole === RoleTexts.MEMBER
  );
};

export const userIsTournamentModerator = ({
  userRole,
  userId,
  ownerId,
}: {
  userRole: RoleText;
  userId: string;
  ownerId: string;
}) => {
  return (
    userRole === RoleTexts.ADMIN ||
    userRole === RoleTexts.MODERATOR ||
    userId === ownerId
  );
};
