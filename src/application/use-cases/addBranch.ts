// src/application/use-cases/addBranch.ts

import { FranchiseRepository } from "../../domain/repositories/franchise.repository.js";
import { Branch } from "../../domain/entities/branch.js";

interface CreateBranchInput {
  name:string;
  address:string;
  phone:string
}
export class AddBranchUseCase {
  constructor(private franchiseRepo: FranchiseRepository) {}

  async execute(franchiseId: number, branch: CreateBranchInput): Promise<Branch> {
    return this.franchiseRepo.addBranch(franchiseId, branch);
  }
}
