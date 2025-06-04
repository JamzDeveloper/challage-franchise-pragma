import { z } from "zod";

export const addProductToBranchSchema = z.object({
  branchId: z.number(),
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().optional(),
  stock: z.number().int().nonnegative(),
});
