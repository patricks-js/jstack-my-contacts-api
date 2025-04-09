import { DEFAULT_EXPIRATION_TIME, redisClient } from "@/lib/redis";

export async function getCacheDataOrSet(
  key: string,
  callback: () => Promise<unknown>,
) {
  const cachedData = await redisClient.get(key);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const data = await callback();

  await redisClient.set(
    key,
    JSON.stringify(data),
    "EX",
    DEFAULT_EXPIRATION_TIME,
  );

  return data;
}
