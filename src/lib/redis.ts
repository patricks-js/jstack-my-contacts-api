import Redis from "ioredis";

export const redisClient = new Redis();

export const DEFAULT_EXPIRATION_TIME = 60;

export const CONTACT_KEY = "contact:";
export const CONTACT_LIST_KEY = "list:contact";
export const CATEGORY_KEY = "category:";
export const CATEGORY_LIST_KEY = "list:category";
