export interface CacheRepository<T> {
  set(keySuffix: string, data: T): Promise<void>;
  setById(id: string, data: T): Promise<void>;
  get(keySuffix: string): Promise<T | undefined | null>;
  getById(id: string): Promise<T | undefined | null>;
  delete(keySuffix: string): Promise<void>;
}
