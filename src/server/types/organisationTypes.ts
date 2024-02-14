import { z } from "zod";

export const CreateOrganisation = z.object({
  name: z.string().min(1, {
    message: "Name must be at least 1 characters.",
  }),
});

export const JoinOrganisation = z.object({
  id: z.string().min(1, {
    message: "Name must be at least 1 characters.",
  }),
});

export const organisationIdSchema = z.object({ id: z.string().min(1) });
