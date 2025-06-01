"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFranchiseSchema = void 0;
// src/handlers/createFranchise/validateCreateFranchiseDto.ts
const zod_1 = require("zod");
exports.createFranchiseSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    address: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email("El email debe ser válido"),
});
