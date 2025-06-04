import { Product } from "../entities/product";

export interface ProductRepository {
  updateStockProduct(
    brandId: number,
    productId: number,
    stock: number
  ): Promise<Product>;
}
