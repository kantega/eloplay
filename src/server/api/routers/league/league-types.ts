import { z } from "zod";

export const CreateLeague = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 characters.",
  }),
});
