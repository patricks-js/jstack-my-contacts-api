import { container } from "tsyringe";

import type { Category } from "@/models/category";
import type { Contact } from "@/models/contact";
import type { CacheRepository } from "@/repositories/contracts/cache-repository";
import type { CategoryRepository } from "@/repositories/contracts/category-repository";
import type { ContactRepository } from "@/repositories/contracts/contact-repository";
import { PostgresCategoryRepository } from "@/repositories/postgres/postgres-category-repository";
import { PostgresContactRepository } from "@/repositories/postgres/postgres-contact-repository";
import { RedisCategoryRepository } from "@/repositories/redis/redis-category-repository";
import { RedisContactRepository } from "@/repositories/redis/redis-contact-repository";
import { CategoryService } from "@/services/category-service";
import { ContactService } from "@/services/contact-service";
import { Tokens } from "./tokens";

container.register<CategoryRepository>(Tokens.CategoryRepository, {
  useClass: PostgresCategoryRepository,
});
container.register<ContactRepository>(Tokens.ContactRepository, {
  useClass: PostgresContactRepository,
});
container.register<CacheRepository<Category>>(Tokens.CategoryCache, {
  useClass: RedisCategoryRepository,
});
container.register<CacheRepository<Contact>>(Tokens.ContactCache, {
  useClass: RedisContactRepository,
});
container.register(Tokens.CategoryService, { useClass: CategoryService });
container.register(Tokens.ContactService, { useClass: ContactService });

export { container };
