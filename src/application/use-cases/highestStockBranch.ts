import { Product } from "../../domain/entities/product";
import { FranchiseRepository } from "../../domain/repositories/franchise.repository";

export class HighestStockPerBranch {
  constructor(private franchiseRepository: FranchiseRepository) {}

  async execute(franchiseId: number): Promise<Array<any>> {
    const savedFranchise = await this.franchiseRepository.getTopStockProductsPerBranch(
      franchiseId
    );
    return savedFranchise;
  }
}
