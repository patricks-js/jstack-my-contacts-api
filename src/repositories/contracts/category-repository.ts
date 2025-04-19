import type { Category } from "@/models/category";

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | undefined | null>;
  findByName(name: string): Promise<Category | undefined | null>;
  create(data: Category): Promise<Category>;
  update(data: Category): Promise<Category>;
  delete(id: string): Promise<void>;
}
