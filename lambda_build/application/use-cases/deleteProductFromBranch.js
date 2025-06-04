"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProductFromBranchUseCase = void 0;
class DeleteProductFromBranchUseCase {
    constructor(branchRepository) {
        this.branchRepository = branchRepository;
    }
    async execute(branchId, productId) {
        await this.branchRepository.deleteProductFromBranch(branchId, productId);
    }
}
exports.DeleteProductFromBranchUseCase = DeleteProductFromBranchUseCase;
