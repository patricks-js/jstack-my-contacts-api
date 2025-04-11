import { randomUUIDv7 } from "bun";

import type { Contact, ContactWithCategory } from "@/models/contact";
import type { CacheRepository } from "@/repositories/contracts/cache-repository";
import type { ContactRepository } from "@/repositories/contracts/contact-repository";

export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly contactCache: CacheRepository<
      Contact | ContactWithCategory
    >,
  ) {}

  async getAll(): Promise<ContactWithCategory[]> {
    const contactsCached = await this.contactCache.getAll();
    if (contactsCached) return contactsCached as ContactWithCategory[];

    const contacts = await this.contactRepository.findAll();

    await this.contactCache.set("all", contacts);

    return contacts;
  }

  async getById(id: string): Promise<ContactWithCategory> {
    const contactCached = await this.contactCache.getById(id);
    if (contactCached) return contactCached as ContactWithCategory;

    const contact = await this.contactRepository.findById(id);
    if (!contact) throw new Error("Contact not found"); // TODO: Create a custom error

    await this.contactCache.setById(id, contact);
    return contact;
  }

  // TODO: Create DTO
  async create(data: Omit<Contact, "id">): Promise<Contact> {
    const contactAlreadyExists = await this.contactRepository.findByEmail(
      data.email,
    );
    if (contactAlreadyExists) throw new Error("Contact already exists"); // TODO: Create a custom error

    // TODO: Validate if category exists

    const id = randomUUIDv7();
    const contact = await this.contactRepository.create({
      id,
      ...data,
    });

    await this.contactCache.delete("all");
    return contact;
  }

  // TODO: Create DTO
  async update(
    data: { id: string } & Partial<Omit<Contact, "id">>,
  ): Promise<Contact> {
    let categoryToUpdate = await this.contactRepository.findById(data.id);

    if (!categoryToUpdate) throw new Error("Category not found"); // TODO: Create a custom error

    categoryToUpdate = Object.assign({}, categoryToUpdate, data);
    const categoryUpdated = await this.contactRepository.update({
      id: categoryToUpdate.id,
      name: categoryToUpdate.name,
      email: categoryToUpdate.email,
      phone: categoryToUpdate.phone,
      categoryId: categoryToUpdate.category.id,
    });

    await this.contactCache.delete(categoryToUpdate.id);
    await this.contactCache.setById(categoryToUpdate.id, categoryUpdated);

    return categoryUpdated;
  }

  async delete(id: string): Promise<void> {
    await this.contactCache.delete(id);

    await this.contactCache.delete(id);
    await this.contactCache.delete("all");
  }
}
