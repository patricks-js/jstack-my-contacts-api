export interface Category {
  id: string;
  name: string;
}

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  save(category: Category): Promise<{ id: string }>;
  update(category: Category): Promise<void>;
  delete(id: string): Promise<void>;
}
