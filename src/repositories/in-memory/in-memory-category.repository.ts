import type { Category, CategoryRepository } from "../category.repository";

export class InMemoryCategoryRepository implements CategoryRepository {
  private categories: Map<string, Category>;

  constructor() {
    this.categories = new Map<string, Category>();
  }

  async findByName(name: string): Promise<Category | null> {
    const category = Array.from(this.categories.values()).find(
      (category) => category.name === name,
    );

    return category || null;
  }

  async save(category: Category): Promise<{ id: string }> {
    this.categories.set(category.id, category);
    return { id: category.id };
  }

  async create(category: Category): Promise<void> {
    this.categories.set(category.id, category);
  }

  async findById(id: string): Promise<Category | null> {
    const category = this.categories.get(id);
    return category || null;
  }

  async findAll(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async update(category: Category): Promise<void> {
    this.categories.set(category.id, category);
  }

  async delete(id: string): Promise<void> {
    this.categories.delete(id);
  }
}
