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
  delete(id: string): Promise<void>;
}
