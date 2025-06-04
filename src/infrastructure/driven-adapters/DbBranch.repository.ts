import { Pool } from "mysql2/promise";
import { Product } from "../../domain/entities/product";
import { BranchRepository } from "../../domain/repositories/branch.repository";

export class DbBranchRepository implements BranchRepository {
  constructor(private pool: Pool) {}

  async addProductToBranch(branchId: number, product: Product): Promise<void> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      // Verificar que la sucursal existe
      const [branchRows] = await connection.query(
        "SELECT id FROM branches WHERE id = ? LIMIT 1",
        [branchId]
      );

      if ((branchRows as any[]).length === 0) {
        throw new Error(`Branch with ID ${branchId} does not exist`);
      }

      // Verificar si ya existe el producto con ese nombre en esa sucursal
      const [productRows] = await connection.query(
        "SELECT id FROM products WHERE name = ? AND branch_id = ? LIMIT 1",
        [product.name, branchId]
      );

      if ((productRows as any[]).length > 0) {
        throw new Error(
          `Product "${product.name}" already exists in branch ${branchId}`
        );
      }

      // Insertar nuevo producto
      await connection.query(
        `INSERT INTO products (name, price, description, branch_id, stock)
         VALUES (?, ?, ?, ?, ?)`,
        [
          product.name,
          product.price,
          product.description ?? null,
          branchId,
          product.stock ?? 0,
        ]
      );

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      console.error("Error adding product to branch:", err);
      throw err;
    } finally {
      connection.release();
    }
  }

  async deleteProductFromBranch(
    branchId: number,
    productId: number
  ): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      // Verificar que el producto pertenece a la sucursal
      const [rows] = await connection.query(
        "SELECT id FROM products WHERE id = ? AND branch_id = ? LIMIT 1",
        [productId, branchId]
      );

      if ((rows as any[]).length === 0) {
        throw new Error("Product not found in specified branch");
      }

      // Eliminar producto (o puedes hacer soft delete si quieres)
      await connection.query("DELETE FROM products WHERE id = ?", [productId]);

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async allProductsToBranch(branchId: number): Promise<Product[]> {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query(
        "SELECT * FROM products WHERE branch_id = ?",
        [branchId]
      );
      return rows as Product[];
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }
}
