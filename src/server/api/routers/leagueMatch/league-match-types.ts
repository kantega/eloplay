import { z } from "zod";

export const CreateLeagueMatch = z.object({
  winnerId: z.string().min(1),
  loserId: z.string().min(1),
});

export const latestEloGainSchema = z.array(z.number());
