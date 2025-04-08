import { sql } from "bun";
import type { Category, CategoryRepository } from "../category.repository";

export class PostgresCategoryRepository implements CategoryRepository {
  async findAll(): Promise<Category[]> {
    const categories: Category[] = await sql`
      SELECT * FROM categories
      ORDER BY name ASC
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
    const { id, name } = category;

    await sql`
      UPDATE categories
      SET name = ${name}
      WHERE id = ${id}
    `;
  }

  async delete(id: string): Promise<void> {
    await sql`
      DELETE FROM categories
      WHERE id = ${id}
    `;
  }
}
