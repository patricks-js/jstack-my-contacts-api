import { redisClient } from "@/lib/redis";
import type { Category } from "@/models/category";
import type { CacheRepository } from "../contracts/cache-repository";

export class RedisCategoryRepository implements CacheRepository<Category> {
  private ttl = 3600;
  private prefix = "category";

  async set(keySuffix: string, data: Category | Category[]): Promise<void> {
    const key = this.composeKey(keySuffix);
    const value = JSON.stringify(data);

    await redisClient.set(key, value, "EX", this.ttl);
  }

  async setById(id: string, data: Category | Category[]): Promise<void> {
    const key = this.composeKey(id);
    const value = JSON.stringify(data);

    await redisClient.set(key, value, "EX", this.ttl);
  }

  async get(
    keySuffix: string,
  ): Promise<Category | Category[] | null | undefined> {
    const key = this.composeKey(keySuffix);
    const data = await redisClient.get(key);

    return data && JSON.parse(data);
  }

  async getById(id: string): Promise<Category | Category[] | null | undefined> {
    const key = this.composeKey(id);
    const data = await redisClient.get(key);

    return data && JSON.parse(data);
  }

  async delete(keySuffix: string): Promise<void> {
    const key = this.composeKey(keySuffix);

    await redisClient.del(key);
  }

  private composeKey(keySuffix: string): string {
    return `${this.prefix}:${keySuffix}`;
  }
}
