import { z } from "zod";

export const CreatePlayer = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 characters.",
  }),
  office: z.string().min(1, {
    message: "Office must be at least 1 characters.",
  }),
});
