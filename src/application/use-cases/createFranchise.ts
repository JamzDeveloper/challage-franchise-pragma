// src/application/use-cases/createFranchise.ts
import { Franchise } from "../../domain/entities/franchise";
import { FranchiseRepository } from "../../domain/repositories/franchise.repository";
interface CreateFranchiseInput {
  name: string;
  address?: string;
  phone?: string;
  email: string;
}

export class CreateFranchiseUseCase {
  constructor(private franchiseRepo: FranchiseRepository) {}

  async execute(data: CreateFranchiseInput): Promise<Franchise> {
    const franchise: CreateFranchiseInput = {
      name: data.name!,
      address: data.address || "",
      phone: data.phone || "",
      email: data.email!,
    };
    const savedFranchise = await this.franchiseRepo.save(franchise);

    return savedFranchise;
  }
}
