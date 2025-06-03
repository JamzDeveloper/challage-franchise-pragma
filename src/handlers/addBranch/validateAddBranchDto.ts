import { z } from "zod";

export const createBranchSchema  = z.object({
  franchiseId: z.number(),
  name: z.string().min(1),
  address: z.string(),
  phone:z.string()
});
