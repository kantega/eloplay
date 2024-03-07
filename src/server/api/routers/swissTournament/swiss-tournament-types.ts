import { z } from "zod";
import { teamIdSchema } from "../team/team-types";

export const CreateSwissTournament = z
  .object({
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
  })
  .extend(teamIdSchema.shape);

export const GetSwissTournament = z
  .object({
    tournamentId: z.string().min(1),
    leagueId: z.string().min(1),
  })
  .extend(teamIdSchema.shape);

export const GetAllSwissTournament = z
  .object({
    leagueId: z.string().min(1),
  })
  .extend(teamIdSchema.shape);
