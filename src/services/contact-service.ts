import { randomUUIDv7 } from "bun";
import { inject, injectable, registry } from "tsyringe";

import { Tokens } from "@/config/tokens";
import type { Contact, ContactWithCategory } from "@/models/contact";
import type { CacheRepository } from "@/repositories/contracts/cache-repository";
import type { ContactRepository } from "@/repositories/contracts/contact-repository";
import { PostgresContactRepository } from "@/repositories/postgres/postgres-contact-repository";
import { RedisContactRepository } from "@/repositories/redis/redis-contact-repository";
import { CategoryService } from "./category-service";
import { ConflictError } from "./errors/conflict";
import { ResourceNotFoundError } from "./errors/resource-not-found";

@registry([
  { token: Tokens.ContactRepository, useClass: PostgresContactRepository },
  { token: Tokens.ContactCache, useClass: RedisContactRepository },
  { token: Tokens.CategoryService, useClass: CategoryService },
])
@injectable()
export class ContactService {
  constructor(
    @inject(Tokens.ContactRepository)
    private readonly contactRepository: ContactRepository,
    @inject(Tokens.ContactCache)
    private readonly contactCache: CacheRepository<
      Contact | ContactWithCategory
    >,
    @inject(Tokens.CategoryService)
    private readonly categoryService: CategoryService,
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
    if (!contact) throw new ResourceNotFoundError("Contact");

    await this.contactCache.setById(id, contact);
    return contact;
  }

  // TODO: Create DTO
  async create(
    data: Omit<Contact, "id" | "categoryId"> & { categoryId?: string },
  ): Promise<Contact> {
    const contactAlreadyExists = await this.contactRepository.findByEmail(
      data.email,
    );
    if (contactAlreadyExists) throw new ConflictError("Contact already exists");

    if (data.categoryId) {
      await this.categoryService.getById(data.categoryId);
    }

    const id = randomUUIDv7();
    const contact = await this.contactRepository.create({
      id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      categoryId: data.categoryId,
    });

    await this.contactCache.delete("all");
    return contact;
  }

  // TODO: Create DTO
  async update(data: Partial<Contact> & { id: string }): Promise<Contact> {
    const contactToUpdate = await this.contactRepository.findById(data.id);

    if (!contactToUpdate) throw new ResourceNotFoundError("Contact");

    if (data.email && data.email !== contactToUpdate.email) {
      const contactAlreadyExists = await this.contactRepository.findByEmail(
        data.email,
      );

      if (contactAlreadyExists && contactAlreadyExists.id !== data.id) {
        throw new ConflictError("Contact already exists");
      }
    }

    const contactUpdated = await this.contactRepository.update({
      id: contactToUpdate.id,
      name: data.name ?? contactToUpdate.name,
      email: data.email ?? contactToUpdate.email,
      phone: data.phone ?? contactToUpdate.phone,
      categoryId: data.categoryId,
    });

    await this.contactCache.delete("all");
    await this.contactCache.delete(contactToUpdate.id);
    await this.contactCache.setById(contactToUpdate.id, contactUpdated);

    return contactUpdated;
  }

  async delete(id: string): Promise<void> {
    await this.contactRepository.delete(id);

    await this.contactCache.delete(id);
    await this.contactCache.delete("all");
  }
}
