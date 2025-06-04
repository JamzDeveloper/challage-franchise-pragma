// src/application/use-cases/deleteProductFromBranch.ts
import { BranchRepository } from "../../domain/repositories/branch.repository";

export class DeleteProductFromBranchUseCase {
  constructor(private branchRepository: BranchRepository) {}

  async execute(branchId: number, productId: number): Promise<void> {
    await this.branchRepository.deleteProductFromBranch(branchId, productId);
  }
}
