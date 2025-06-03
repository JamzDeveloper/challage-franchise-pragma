import { Branch } from "../entities/branch";
import { Franchise } from "../entities/franchise";

export interface FranchiseRepository {
  save(franchise: Partial<Franchise>): Promise<Franchise>;
  find():Promise<Array<Franchise>>
  findById(id: string): Promise<Franchise | null>;
  addBranch(franchiseId: number, branch: Partial<Branch>): Promise<void>;
}
