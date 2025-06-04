import { Product } from "../entities/product";

export interface BranchRepository {
  addProductToBranch(branchId: number, product: Product): Promise<void>;

  deleteProductFromBranch(branchId: number, productId: number): Promise<void>;
}
