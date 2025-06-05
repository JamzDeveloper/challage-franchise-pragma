import { Product } from "../../domain/entities/product";
import { BranchRepository } from "../../domain/repositories/branch.repository";
import { ValidationError } from "../response/responseHandler";

export class AddProductToBranchUseCase {
  constructor(private branchRepository: BranchRepository) {}

  async execute(branchId: number, product: Product): Promise<Product> {
    if (product.stock < 0) {
      throw new ValidationError("Stock cannot be negative");
    }

    return await this.branchRepository.addProductToBranch(branchId, product);
  }
}
