import { DEFAULT_EXPIRATION_TIME, redisClient } from "@/lib/redis";

export async function revalidateCacheOrDelete(key: string, value?: unknown) {
  await redisClient.del(key);

  if (value) {
    await redisClient.set(
      key,
      JSON.stringify(value),
      "EX",
      DEFAULT_EXPIRATION_TIME,
    );
  }
}
