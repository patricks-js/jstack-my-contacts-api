export interface CacheRepository<T> {
  set(keySuffix: string, data: T | T[]): Promise<void>;
  setById(id: string, data: T | T[]): Promise<void>;
  get(keySuffix: string): Promise<T | T[] | undefined | null>;
  getAll(keySuffix?: string): Promise<T[] | undefined | null>;
  getById(id: string): Promise<T | T[] | undefined | null>;
  delete(keySuffix: string): Promise<void>;
}
