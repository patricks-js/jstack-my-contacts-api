import { sql } from "bun";
import { injectable } from "tsyringe";

import type { Category } from "@/models/category";
import type { CategoryRepository } from "@/repositories/contracts/category-repository";

@injectable()
export class PostgresCategoryRepository implements CategoryRepository {
  async findAll(): Promise<Category[]> {
    const categories: Category[] = await sql`
      SELECT * FROM categories
      ORDER BY name ASC
    `;

    return categories.slice(0, categories.length);
  }

  async findById(id: string): Promise<Category | undefined | null> {
    const [category]: Category[] = await sql`
      SELECT * FROM categories
      WHERE id = ${id}
    `;

    return category;
  }

  async findByName(name: string): Promise<Category | undefined | null> {
    const [category]: Category[] = await sql`
      SELECT * FROM categories
      WHERE name LIKE ${name}
    `;

    return category;
  }

  async create(data: Category): Promise<Category> {
    const { id, name } = data;

    const [result]: Category[] = await sql`
      INSERT INTO categories (id, name)
      VALUES (${id}, ${name})
      RETURNING id, name
    `;

    if (!result) {
      throw new Error("Failed to create category");
    }

    return result;
  }

  async update(data: Category): Promise<Category> {
    const { id, name } = data;

    const [result]: Category[] = await sql`
      UPDATE categories
      SET name = ${name}
      WHERE id = ${id}
      RETURNING id, name
    `;

    if (!result) {
      throw new Error(`Failed to update category: ${id}`);
    }

    return result;
  }

  async delete(id: string): Promise<void> {
    await sql`
      DELETE FROM categories
      WHERE id = ${id}
    `;
  }

  // TODO: Implement pagination, sorting, and filtering
  private applyFilters() {}
  private applySorting() {}
  private applyPagination() {}
}
