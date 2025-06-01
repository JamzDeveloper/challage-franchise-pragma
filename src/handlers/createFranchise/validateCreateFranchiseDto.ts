// src/handlers/createFranchise/validateCreateFranchiseDto.ts
import { z } from "zod";

export const createFranchiseSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("El email debe ser válido"),
});

export type CreateFranchiseDto = z.infer<typeof createFranchiseSchema>;
