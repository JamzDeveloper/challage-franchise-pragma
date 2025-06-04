import { Product } from "../../domain/entities/product";
import { BranchRepository } from "../../domain/repositories/branch.repository";
import { DbBranchRepository } from "../../infrastructure/driven-adapters/dbBranch.repository.js";

export class AllProductsToBranch {
  constructor(private branchRepository: DbBranchRepository) {}

  async execute(branchId: number): Promise<Array<Product>> {
    const savedFranchise = await this.branchRepository.allProductsToBranch(
      branchId
    );

    return savedFranchise;
  }
}
