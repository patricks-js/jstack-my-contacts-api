import { randomUUIDv7 } from "bun";
import { inject, injectable } from "tsyringe";

import { Tokens } from "@/config/tokens";
import type { Category } from "@/models/category";
import type { CacheRepository } from "@/repositories/contracts/cache-repository";
import type { CategoryRepository } from "@/repositories/contracts/category-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found";

@injectable()
export class CategoryService {
  constructor(
    @inject(Tokens.CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
    @inject(Tokens.CategoryCache)
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
    if (!category) throw new ResourceNotFoundError("Category");

    await this.categoryCache.setById(id, category);
    return category;
  }

  async getByName(name: string): Promise<Category> {
    const categoryCached = await this.categoryCache.get(name);
    if (categoryCached) return categoryCached as Category;

    const category = await this.categoryRepository.findByName(name);

    if (!category) throw new ResourceNotFoundError("Category");

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

  // TODO: Create DTO
  async update(data: { id: string; name?: string }): Promise<Category> {
    let categoryToUpdate = await this.categoryRepository.findById(data.id);

    if (!categoryToUpdate) throw new ResourceNotFoundError("Category");

    categoryToUpdate = Object.assign({}, categoryToUpdate, data);
    const categoryUpdated =
      await this.categoryRepository.update(categoryToUpdate);

    await this.categoryCache.delete(categoryToUpdate.id);
    await this.categoryCache.setById(categoryToUpdate.id, categoryUpdated);

    return categoryUpdated;
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.delete(id);

    await this.categoryCache.delete(id);
    await this.categoryCache.delete("all");
  }
}
