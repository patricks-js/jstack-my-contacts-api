import { randomUUIDv7 } from "bun";

import type { Category } from "@/models/category";
import type { CacheRepository } from "@/repositories/contracts/cache-repository";
import type { CategoryRepository } from "@/repositories/contracts/category-repository";

export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly categoryCache: CacheRepository<Category>,
  ) {}

  async getAll(): Promise<Category[]> {
    const categoriesCached = await this.categoryCache.getAll();
    if (categoriesCached) return categoriesCached;

    const categories = await this.categoryRepository.findAll();

    await this.categoryCache.set("all", categories);

    return categories;
  }

  async getById(id: string): Promise<Category> {
    const categoryCached = await this.categoryCache.getById(id);
    if (categoryCached) return categoryCached as Category;

    const category = await this.categoryRepository.findById(id);
    if (!category) throw new Error("Category not found"); // TODO: Create a custom error

    await this.categoryCache.setById(id, category);
    return category;
  }

  async getByName(name: string): Promise<Category> {
    const categoryCached = await this.categoryCache.get(name);
    if (categoryCached) return categoryCached as Category;

    const category = await this.categoryRepository.findByName(name);

    if (!category) throw new Error("Category not found"); // TODO: Create a custom error

    await this.categoryCache.set(name, category);
    return category;
  }

  // TODO: Create DTO
  async create(data: Omit<Category, "id">): Promise<Category> {
    const id = randomUUIDv7();

    const category = await this.categoryRepository.create({
      id,
      ...data,
    });

    await this.categoryCache.delete("all");
    return category;
  }

  async update(data: Category): Promise<Category> {
    const categoryToUpdate = await this.categoryRepository.findById(data.id);

    if (!categoryToUpdate) throw new Error("Category not found"); // TODO: Create a custom error

    const category = await this.categoryRepository.update(categoryToUpdate);

    await this.categoryCache.delete(categoryToUpdate.id);
    await this.categoryCache.setById(categoryToUpdate.id, data);

    return category;
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.delete(id);

    await this.categoryCache.delete(id);
    await this.categoryCache.delete("all");
  }
}
