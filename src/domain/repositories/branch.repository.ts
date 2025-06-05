import { Product } from "../entities/product";

export interface BranchRepository {
  addProductToBranch(branchId: number, product: Product): Promise<Product>;

  deleteProductFromBranch(branchId: number, productId: number): Promise<void>;
  allProductsToBranch(branchId: number): Promise<Product[]>;
}
