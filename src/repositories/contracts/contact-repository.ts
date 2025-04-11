import type { Contact, ContactWithCategory } from "@/models/contact";

export interface ContactRepository {
  findAll(): Promise<ContactWithCategory[]>;
  findById(id: string): Promise<ContactWithCategory | undefined | null>;
  findByEmail(email: string): Promise<ContactWithCategory | undefined | null>;
  create(contact: Contact): Promise<Contact>;
  update(contact: Contact): Promise<Contact>;
  delete(id: string): Promise<void>;
}
