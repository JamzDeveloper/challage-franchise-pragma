"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBranchSchema = void 0;
const zod_1 = require("zod");
exports.createBranchSchema = zod_1.z.object({
    franchiseId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    address: zod_1.z.string(),
});
