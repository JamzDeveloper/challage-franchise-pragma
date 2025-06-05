import { z } from "zod";

export const updateProductSchema = z.object({
  stock: z.number().min(0),
});
