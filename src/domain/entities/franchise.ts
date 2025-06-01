import { Branch } from "./branch";

export interface Franchise {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email: string;
  branches: Branch[];
}