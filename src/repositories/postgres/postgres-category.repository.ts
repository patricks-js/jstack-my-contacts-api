import { sql } from "bun";
import type { Category, CategoryRepository } from "../category.repository";

export class PostgresCategoryRepository implements CategoryRepository {
  async findAll(): Promise<Category[]> {
    const categories: Category[] = await sql`
      SELECT * FROM categories
    `;

    return categories.slice(0, categories.length);
  }

  async findById(id: string): Promise<Category | null> {
    const [category]: Category[] = await sql`
      SELECT * FROM categories
      WHERE id = ${id}
    `;

    return category ?? null;
  }

  async findByName(name: string): Promise<Category | null> {
    const [category]: Category[] = await sql`
      SELECT * FROM categories
      WHERE name LIKE ${`${name}%`}
    `;

    return category ?? null;
  }

  async save(category: Category): Promise<{ id: string }> {
    const { id, name } = category;

    const [result] = await sql`
      INSERT INTO categories (id, name)
      VALUES (${id}, ${name})
      RETURNING id
    `;

    return result;
  }

  async update(category: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
