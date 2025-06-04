import mysql, { RowDataPacket } from "mysql2/promise";
import { Product } from "../../domain/entities/product";
import { ProductRepository } from "../../domain/repositories/update.repository";

export class DbProductRepository implements ProductRepository {
  private pool: mysql.Pool;

  constructor(pool: mysql.Pool) {
    this.pool = pool;
  }

  async updateStockProduct(
    branchId: number,
    productId: number,
    stock: number
  ): Promise<Product> {
    const connection = await this.pool.getConnection();

    try {
      const updateQuery = `
        UPDATE branch_products
        SET stock = ?
        WHERE branch_id = ? AND product_id = ?
      `;

      const [updateResult] = await connection.execute(updateQuery, [
        stock,
        branchId,
        productId,
      ]);

      const selectQuery = `
        SELECT p.id, p.name, bp.stock
        FROM products p
        JOIN branch_products bp ON p.id = bp.product_id
        WHERE bp.branch_id = ? AND bp.product_id = ?
      `;

      const [rows] = await connection.execute<RowDataPacket[]>(selectQuery, [
        branchId,
        productId,
      ]);

      if (rows.length === 0) {
        throw new Error("Producto no encontrado en la sucursal.");
      }

      const row = rows[0];

      return {
        id: row.id,
        name: row.name,
        stock: row.stock,
        price: row.price,
      };
    } finally {
      connection.release();
    }
  }
}
