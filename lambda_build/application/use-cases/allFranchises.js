"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllFranchisesUseCase = void 0;
class AllFranchisesUseCase {
    constructor(franchiseRepo) {
        this.franchiseRepo = franchiseRepo;
    }
    async execute() {
        const savedFranchise = await this.franchiseRepo.find();
        return savedFranchise;
    }
}
exports.AllFranchisesUseCase = AllFranchisesUseCase;
