import { sql } from "bun";
import { injectable } from "tsyringe";

import type { Contact, ContactWithCategory } from "@/models/contact";
import type { ContactRepository } from "@/repositories/contracts/contact-repository";

type ContactJoinCategory = Omit<Contact, "category_id"> & {
  category_id: string;
  category_name: string;
};

@injectable()
export class PostgresContactRepository implements ContactRepository {
  async findAll(): Promise<ContactWithCategory[]> {
    const contacts: ContactJoinCategory[] = await sql`
      SELECT
        contacts.id,
        contacts.name,
        contacts.email,
        contacts.phone,
        categories.id AS category_id,
        categories.name AS category_name
      FROM contacts
      LEFT JOIN
        categories ON categories.id = contacts.category_id
      ORDER BY name ASC
    `;

    const contactsWithCategory: ContactWithCategory[] = contacts
      .map((contact) => {
        const contactToReturn = {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
        };

        if (contact.category_id) {
          Object.defineProperties(contactToReturn, {
            category: {
              value: {
                id: contact.category_id,
                name: contact.category_name,
              },
            },
          });
        }

        return contactToReturn;
      })
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
        categories.id AS category_id,
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
        categories.id AS category_id,
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

  async create(data: ContactRepository.CreateParams): Promise<Contact> {
    const contactToInsert = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
    };

    if (data.categoryId) {
      Object.defineProperty(contactToInsert, "category_id", {
        value: data.categoryId,
      });
    }

    const [result]: Contact[] = await sql`
      INSERT INTO contacts ${sql(contactToInsert)}
      RETURNING *
    `;

    if (!result) {
      throw new Error("Failed to create contact");
    }

    return result;
  }

  async update(data: ContactRepository.UpdateParams): Promise<Contact> {
    const { id, name, email, phone, categoryId } = data;

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
