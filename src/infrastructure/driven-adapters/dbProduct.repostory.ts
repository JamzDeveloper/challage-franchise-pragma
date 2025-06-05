import mysql, { RowDataPacket } from "mysql2/promise";
import { Product } from "../../domain/entities/product";
import { ProductRepository } from "../../domain/repositories/update.repository";
import { NotFoundError } from "../../application/response/responseHandler";

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
        UPDATE products
        SET stock = ?
        WHERE branch_id = ? AND id = ?
      `;

      const [updateResult] = await connection.execute(updateQuery, [
        stock,
        branchId,
        productId,
      ]);

      const selectQuery = `
        SELECT * 
        FROM products p
        JOIN branches bp ON p.branch_id = bp.id
        WHERE p.branch_id = ? AND p.id = ?
      `;

      const [rows] = await connection.execute<RowDataPacket[]>(selectQuery, [
        branchId,
        productId,
      ]);

      if (rows.length === 0) {
        throw new NotFoundError("Producto no encontrado en la sucursal.");
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
