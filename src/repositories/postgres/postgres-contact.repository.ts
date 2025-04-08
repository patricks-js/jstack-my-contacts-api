import { sql } from "bun";
import type {
  Contact,
  ContactRepository,
  ContactWithCategory,
} from "../contact.repository";

type ContactJoinCategory = Omit<Contact, "category_id"> & {
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
          name: contact.category_name,
        },
      }))
      .slice(0, contacts.length);

    return contactsWithCategory;
  }

  async findById(id: string): Promise<Contact | null> {
    const [contact]: Contact[] = await sql`
      SELECT id, name, email, phone, category_id
      FROM contacts
      WHERE id = ${id}
    `;

    return contact ?? null;
  }

  async findByEmail(email: string): Promise<Contact | null> {
    const [contact]: Contact[] = await sql`
      SELECT id, name, email, phone, category_id
      FROM contacts
      WHERE email = ${email}
    `;

    return contact ?? null;
  }

  async save(contact: Contact): Promise<{ id: string }> {
    const { id, name, email, phone, categoryId } = contact;

    const [newContact]: { id: string }[] = await sql`
      INSERT INTO contacts
        (id, name, email, phone, category_id)
      VALUES
        (${id}, ${name}, ${email}, ${phone}, ${categoryId})
      RETURNING id
    `;

    if (!newContact) {
      throw new Error("Failed to create contact");
    }

    return newContact;
  }

  async update(contact: Contact): Promise<void> {
    const { id, name, email, phone, categoryId } = contact;

    await sql`
      UPDATE contacts
      SET name = ${name}, email = ${email}, phone = ${phone}, category_id = ${categoryId}
      WHERE id = ${id}
    `;
  }

  async delete(id: string): Promise<void> {
    await sql`
      DELETE FROM contacts
      WHERE id = ${id}
    `;
  }
}
