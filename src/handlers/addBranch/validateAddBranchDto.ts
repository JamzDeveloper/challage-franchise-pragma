import { z } from "zod";

export const createBranchSchema  = z.object({
  franchiseId: z.string().uuid(),
  name: z.string().min(1),
  address: z.string(),
});
