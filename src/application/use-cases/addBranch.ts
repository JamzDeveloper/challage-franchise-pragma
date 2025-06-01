// src/application/use-cases/addBranch.ts

import { FranchiseRepository } from "../../domain/repositories/franchise.repository.js";
import { Branch } from "../../domain/entities/branch.js";

export class AddBranchUseCase {
  constructor(private franchiseRepo: FranchiseRepository) {}

  async execute(franchiseId: string, branch: Branch): Promise<void> {
    return this.franchiseRepo.addBranch(franchiseId, branch);
  }
}
