export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  categoryId: string;
}

export interface ContactRepository {
  findAll(): Promise<Contact[]>;
  findById(id: string): Promise<Contact | null>;
  findByEmail(email: string): Promise<Contact | null>;
  save(contact: Contact): Promise<{ id: string }>;
  update(contact: Contact): Promise<void>;
  delete(id: string): Promise<void>;
}
