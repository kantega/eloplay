import { z } from "zod";

export const CreateTeam = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 characters.",
  }),
});

export const JoinTeam = z.object({
  id: z.string().min(1, {
    message: "Name must be at least 1 characters.",
  }),
});

export const teamIdSchema = z.object({ teamId: z.string().min(1) });
