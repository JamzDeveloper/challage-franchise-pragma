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
        const franchise = store.get(franchiseId);
        if (!franchise) {
            throw new Error("Franchise not found");
        }
        // Agregar sucursal a la franquicia
        franchise.branches.push(branch);
        // Guardar cambios
        store.set(franchiseId, franchise);
    }
}
exports.DbFranchiseRepository = DbFranchiseRepository;
