import { z } from "zod";

export const CreateSwissTournament = z.object({
  isOpen: z.boolean(),
  name: z
    .string()
    .min(1, {
      message: "Name must be at least 1 characters.",
    })
    .max(20, {
      message: "Name must be at most 20 characters.",
    }),
  leagueId: z.string().min(1),
  roundLimit: z.number().int().min(1).max(100),
  description: z.string().min(1).max(1000).optional(),
  participants: z.array(z.string()).max(100),
});
