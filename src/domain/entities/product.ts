export interface Product {
  id?: string;
  name: string;
  price: number;
  description?: string;
  stock: number; // ← Añadido stock
}
