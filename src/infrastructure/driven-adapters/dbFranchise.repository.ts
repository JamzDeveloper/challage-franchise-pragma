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

  async addBranch(franchiseId: number, branch: Branch): Promise<void> {
    // Validar que exista la franquicia
    const [franchiseRows] = await this.pool.query<RowDataPacket[]>(
      `SELECT id FROM franchises WHERE id = ?`,
      [franchiseId]
    );

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

  async find(): Promise<Array<Franchise>> {
    const query = `SELECT * FROM franchises`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query);

    return rows as Franchise[];
  }
}
