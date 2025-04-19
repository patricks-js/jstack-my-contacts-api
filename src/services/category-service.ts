import { randomUUIDv7 } from "bun";
import { inject, injectable, registry } from "tsyringe";

import { Tokens } from "@/config/tokens";
import type { Category } from "@/models/category";
import type { CacheRepository } from "@/repositories/contracts/cache-repository";
import type { CategoryRepository } from "@/repositories/contracts/category-repository";
import { PostgresCategoryRepository } from "@/repositories/postgres/postgres-category-repository";
import { RedisCategoryRepository } from "@/repositories/redis/redis-category-repository";
import { ConflictError } from "./errors/conflict";
import { ResourceNotFoundError } from "./errors/resource-not-found";

@registry([
  { token: Tokens.CategoryRepository, useClass: PostgresCategoryRepository },
  { token: Tokens.CategoryCache, useClass: RedisCategoryRepository },
])
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

    const categoryAlreadyExists = await this.categoryRepository.findByName(
      data.name,
    );
    if (categoryAlreadyExists) {
      throw new ConflictError("Category already exists");
    }

    const category = await this.categoryRepository.create({
      id,
      ...data,
    });

    await this.categoryCache.delete("all");
    return category;
  }

  // TODO: Create DTO
  async update(data: { id: string; name?: string }): Promise<Category> {
    const categoryToUpdate = await this.categoryRepository.findById(data.id);

    if (!categoryToUpdate) throw new ResourceNotFoundError("Category");

    if (data.name) {
      const categoryAlreadyExists = await this.categoryRepository.findByName(
        data.name,
      );

      if (categoryAlreadyExists && categoryAlreadyExists.id !== data.id) {
        throw new ConflictError("Category already exists");
      }
    }

    const categoryUpdated = await this.categoryRepository.update({
      id: categoryToUpdate.id,
      name: data.name ?? categoryToUpdate.name,
    });

    await this.categoryCache.delete("all");
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
