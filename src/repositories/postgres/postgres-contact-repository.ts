import { sql } from "bun";

import type { Contact, ContactWithCategory } from "@/models/contact";
import type { ContactRepository } from "@/repositories/contracts/contact-repository";

type ContactJoinCategory = Omit<Contact, "category_id"> & {
  category_id: string;
  category_name: string;
};

export class PostgresContactRepository implements ContactRepository {
  async findAll(): Promise<ContactWithCategory[]> {
    const contacts: ContactJoinCategory[] = await sql`
      SELECT
        contacts.id,
        contacts.name,
        contacts.email,
        contacts.phone,
        categories.id AS category_id
        categories.name AS category_name
      FROM contacts
      LEFT JOIN
        categories ON categories.id = contacts.category_id
      ORDER BY name ASC
    `;

    const contactsWithCategory: ContactWithCategory[] = contacts
      .map((contact) => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        category: {
          id: contact.category_id,
          name: contact.category_name,
        },
      }))
      .slice(0, contacts.length);

    return contactsWithCategory;
  }

  async findById(id: string): Promise<ContactWithCategory | undefined | null> {
    const [contact]: ContactJoinCategory[] = await sql`
      SELECT
        contacts.id,
        contacts.name,
        contacts.email,
        contacts.phone,
        categories.id AS category_id
        categories.name AS category_name
      FROM contacts
      LEFT JOIN
        categories ON categories.id = contacts.category_id
      WHERE contacts.id = ${id}
    `;

    if (!contact) {
      return null;
    }

    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      category: {
        id: contact.category_id,
        name: contact.category_name,
      },
    };
  }

  async findByEmail(
    email: string,
  ): Promise<ContactWithCategory | undefined | null> {
    const [contact]: ContactJoinCategory[] = await sql`
      SELECT
        contacts.id,
        contacts.name,
        contacts.email,
        contacts.phone,
        categories.id AS category_id
        categories.name AS category_name
      FROM contacts
      LEFT JOIN
        categories ON categories.id = contacts.category_id
      WHERE contacts.email = ${email}
    `;

    if (!contact) {
      return null;
    }

    return {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      category: {
        id: contact.category_id,
        name: contact.category_name,
      },
    };
  }

  async create(contact: Contact): Promise<Contact> {
    const [result]: Contact[] = await sql`
      INSERT INTO contacts ${sql(contact)}
      RETURNING *
    `;

    if (!result) {
      throw new Error("Failed to create contact");
    }

    return result;
  }

  async update(contact: Contact): Promise<Contact> {
    const { id, name, email, phone, categoryId } = contact;

    const [result] = await sql`
      UPDATE contacts
      SET name = ${name}, email = ${email}, phone = ${phone}, category_id = ${categoryId}
      WHERE id = ${id}
      RETURNING id, name, email, phone, category_id
    `;

    if (!result) {
      throw new Error(`Failed to update contact: ${id}`);
    }

    return result;
  }

  async delete(id: string): Promise<void> {
    await sql`
      DELETE FROM contacts
      WHERE id = ${id}
    `;
  }

  // TODO: Implement pagination, sorting, and filtering
  private applyFilters() {}
  private applySorting() {}
  private applyPagination() {}
}
