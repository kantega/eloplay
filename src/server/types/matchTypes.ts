import { z } from "zod";

export const CreateMatch = z.object({
  player1Id: z.string().min(1),
  player2Id: z.string().min(1),
});
