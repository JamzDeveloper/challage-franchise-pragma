"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProductToBranchUseCase = void 0;
class AddProductToBranchUseCase {
    constructor(branchRepository) {
        this.branchRepository = branchRepository;
    }
    async execute(branchId, product) {
        if (product.stock < 0) {
            throw new Error("Stock cannot be negative");
        }
        await this.branchRepository.addProductToBranch(branchId, product);
    }
}
exports.AddProductToBranchUseCase = AddProductToBranchUseCase;
