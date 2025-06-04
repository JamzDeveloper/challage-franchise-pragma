import { Product } from "./product";

export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?:string
  products?:Product[]
}