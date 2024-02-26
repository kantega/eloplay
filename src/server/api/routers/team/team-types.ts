import { z } from "zod";

export const CreateTeam = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name must be at least 1 characters.",
    })
    .max(20, {
      message: "Name must be at most 20 characters.",
    }),
  leagueName: z
    .string()
    .min(1, {
      message: "League's name must be at least 1 characters.",
    })
    .max(20, {
      message: "League's name must be at most 20 characters.",
    }),
});

export const teamIdSchema = z.object({ teamId: z.string().min(1) });
