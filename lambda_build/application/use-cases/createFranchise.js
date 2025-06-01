"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFranchiseUseCase = void 0;
class CreateFranchiseUseCase {
    constructor(franchiseRepo) {
        this.franchiseRepo = franchiseRepo;
    }
    async execute(data) {
        const franchise = {
            name: data.name,
            address: data.address || "",
            phone: data.phone || "",
            email: data.email,
        };
        const savedFranchise = await this.franchiseRepo.save(franchise);
        return savedFranchise;
    }
}
exports.CreateFranchiseUseCase = CreateFranchiseUseCase;
