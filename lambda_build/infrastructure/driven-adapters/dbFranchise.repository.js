"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbFranchiseRepository = void 0;
const responseHandler_1 = require("../../application/response/responseHandler");
const store = new Map();
class DbFranchiseRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async save(franchise) {
        const query = `
      INSERT INTO franchises (id, name, address, phone, email)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        address = VALUES(address),
        phone = VALUES(phone),
        email = VALUES(email)
    `;
        await this.pool.query(query, [
            franchise.id,
            franchise.name,
            franchise.address,
            franchise.phone,
            franchise.email,
        ]);
        return franchise;
    }
    async findById(id) {
        return store.get(id) ?? null;
    }
    async addBranch(franchiseId, branch) {
        // Validar que exista la franquicia
        const [franchiseRows] = await this.pool.query(`SELECT id FROM franchises WHERE id = ?`, [franchiseId]);
        if (franchiseRows.length === 0) {
            throw new responseHandler_1.NotFoundError(`Franchise with ID ${franchiseId} not found.`);
        }
        // Insertar la sucursal
        const query = `
    INSERT INTO branches (franchise_id, name, address, phone)
    VALUES (?, ?, ?, ?)
  `;
        await this.pool.query(query, [
            franchiseId,
            branch.name,
            branch.address,
            branch.phone,
        ]);
        return { ...branch };
    }
    async find() {
        const query = `SELECT * FROM franchises`;
        const [rows] = await this.pool.query(query);
        return rows;
    }
    async getTopStockProductsPerBranch(franchiseId) {
        const [franchiseRows] = await this.pool.query(`SELECT id FROM franchises WHERE id = ?`, [franchiseId]);
        if (franchiseRows.length === 0) {
            throw new responseHandler_1.NotFoundError(`Franchise with ID ${franchiseId} not found.`);
        }
        const query = `
    SELECT 
      b.id AS branchId,
      b.name AS branchName,
      b.address as branchAddress,
      b.phone as branchPhone,
      p.id AS productId,
      p.name AS productName,
      p.stock,
      p.price
    FROM branches b
    JOIN (
        SELECT 
            branch_id,
            id,
            name,
            stock,
            price
        FROM products p1
        WHERE NOT EXISTS (
            SELECT 1 
            FROM products p2 
            WHERE p2.branch_id = p1.branch_id 
            AND p2.stock > p1.stock
        )
    ) p ON p.branch_id = b.id
    WHERE b.franchise_id = ?
  `;
        const [rows] = await this.pool.query(query, [franchiseId]);
        return rows.map((row) => ({
            branchId: row.branchId,
            branchName: row.branchName,
            branchAddress: row.branchAddress,
            branchPhone: row.branchPhone,
            product: {
                productId: row.productId,
                productName: row.productName,
                stock: row.stock,
                price: row.price,
            },
        }));
    }
}
exports.DbFranchiseRepository = DbFranchiseRepository;
