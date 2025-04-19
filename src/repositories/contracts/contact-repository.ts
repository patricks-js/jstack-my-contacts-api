import type { Contact, ContactWithCategory } from "@/models/contact";

export interface ContactRepository {
  findAll(): Promise<ContactWithCategory[]>;
  findById(id: string): Promise<ContactWithCategory | undefined | null>;
  findByEmail(email: string): Promise<ContactWithCategory | undefined | null>;
  create(data: ContactRepository.CreateParams): Promise<Contact>;
  update(data: ContactRepository.UpdateParams): Promise<Contact>;
  delete(id: string): Promise<void>;
}

export namespace ContactRepository {
  export type CreateParams = Omit<Contact, "categoryId"> & {
    categoryId?: string;
  };

  export type UpdateParams = Partial<CreateParams> & {
    id: string;
  };
}
