"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProductToBranchUseCase = void 0;
const responseHandler_1 = require("../response/responseHandler");
class AddProductToBranchUseCase {
    constructor(branchRepository) {
        this.branchRepository = branchRepository;
    }
    async execute(branchId, product) {
        if (product.stock < 0) {
            throw new responseHandler_1.ValidationError("Stock cannot be negative");
        }
        return await this.branchRepository.addProductToBranch(branchId, product);
    }
}
exports.AddProductToBranchUseCase = AddProductToBranchUseCase;
