import mysql, { RowDataPacket } from "mysql2/promise";
import { Branch } from "../../domain/entities/branch";
import { Franchise } from "../../domain/entities/franchise";
import { FranchiseRepository } from "../../domain/repositories/franchise.repository";

const store = new Map<string, Franchise>();

export class DbFranchiseRepository implements FranchiseRepository {
  private pool: mysql.Pool;

  constructor(pool: mysql.Pool) {
    this.pool = pool;
  }
  async save(franchise: Franchise): Promise<Franchise> {
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

  async findById(id: string): Promise<Franchise | null> {
    return store.get(id) ?? null;
  }
  async addBranch(franchiseId: string, branch: Branch): Promise<void> {
    const franchise = store.get(franchiseId);
    if (!franchise) {
      throw new Error("Franchise not found");
    }
    // Agregar sucursal a la franquicia
    franchise.branches.push(branch);
    // Guardar cambios
    store.set(franchiseId, franchise);
  }
  async find(): Promise<Array<Franchise>> {
    const query = `SELECT * FROM franchises`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query);

    return rows as Franchise[];
  }
}
