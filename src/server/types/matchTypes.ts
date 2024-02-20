import { z } from "zod";

export const CreateMatch = z.object({
  player1Id: z.string().min(1),
  player2Id: z.string().min(1),
});

export const CreateLeagueMatch = z.object({
  winnerId: z.string().min(1),
  loserId: z.string().min(1),
});
