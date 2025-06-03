// src/application/use-cases/createFranchise.ts
import { Franchise } from "../../domain/entities/franchise";
import { FranchiseRepository } from "../../domain/repositories/franchise.repository";

export class AllFranchisesUseCase {
  constructor(private franchiseRepo: FranchiseRepository) {}

  async execute(): Promise<Array<Franchise>> {
    const savedFranchise = await this.franchiseRepo.find();

    return savedFranchise;
  }
}
