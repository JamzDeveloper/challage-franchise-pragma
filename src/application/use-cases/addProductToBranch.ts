import { Product } from "../../domain/entities/product";
import { BranchRepository } from "../../domain/repositories/branch.repository";

export class AddProductToBranchUseCase {
  constructor(private branchRepository: BranchRepository) {}

  async execute(branchId: number, product: Product): Promise<void> {
    if (product.stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    await this.branchRepository.addProductToBranch(branchId, product);
  }
}
