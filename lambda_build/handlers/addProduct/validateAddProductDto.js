"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProductToBranchSchema = void 0;
const zod_1 = require("zod");
exports.addProductToBranchSchema = zod_1.z.object({
    branchId: zod_1.z.number(),
    name: zod_1.z.string().min(1),
    price: zod_1.z.number().positive(),
    description: zod_1.z.string().optional(),
    stock: zod_1.z.number().int().nonnegative(),
});
