import { ProductRepository } from "../../domain/repositories/update.repository";

export class UpdateStockProductFromBranchUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(
    branchId: number,
    productId: number,
    stock: number
  ): Promise<void> {
    await this.productRepository.updateStockProduct(branchId, productId, stock);
  }
}
