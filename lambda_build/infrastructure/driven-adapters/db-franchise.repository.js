"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbFranchiseRepository = void 0;
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
            throw new Error(`Franchise with ID ${franchiseId} not found.`);
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
    }
    async find() {
        const query = `SELECT * FROM franchises`;
        const [rows] = await this.pool.query(query);
        return rows;
    }
}
exports.DbFranchiseRepository = DbFranchiseRepository;
