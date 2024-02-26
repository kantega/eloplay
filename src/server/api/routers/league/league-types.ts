import { z } from "zod";

export const CreateLeague = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name must be at least 1 characters.",
    })
    .max(20, {
      message: "Name must be at most 20 characters.",
    }),
});
