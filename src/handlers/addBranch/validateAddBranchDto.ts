import { z } from "zod";

export const createBranchSchema  = z.object({
  name: z.string().min(1),
  address: z.string(),
  phone:z.string()
});
