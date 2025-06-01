"use strict";
// src/application/use-cases/addBranch.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBranchUseCase = void 0;
class AddBranchUseCase {
    constructor(franchiseRepo) {
        this.franchiseRepo = franchiseRepo;
    }
    async execute(franchiseId, branch) {
        return this.franchiseRepo.addBranch(franchiseId, branch);
    }
}
exports.AddBranchUseCase = AddBranchUseCase;
