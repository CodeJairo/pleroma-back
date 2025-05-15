import { createClient } from 'redis';
import config from 'config/config';

export const redisClient = createClient({
  url: config.redisUrl,
});

redisClient.on('error', err => {
  console.error('Redis Client Error', err);
});

(async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
})();

/**
 * Generates a Redis key by combining a prefix with additional arguments.
 * The arguments are joined with a hyphen and appended to the prefix, separated by a colon.
 *
 * @param prefix - The prefix to use for the Redis key.
 * @param args - Additional string arguments to include in the key.
 * @returns The generated Redis key in the format: `prefix:arg1-arg2-...`.
 */
export function generateRedisKey(prefix: string, ...args: string[]): string {
  return `${prefix}:${args.join('-')}`;
}

/**
 * Sets a value in the Redis cache with a specified expiration time.
 *
 * @param key - The key under which the value will be stored in the Redis cache.
 * @param value - The value to be stored in the Redis cache. It will be serialized to JSON.
 * @param expirationInSeconds - The expiration time for the cache entry, in seconds.
 * @returns A promise that resolves when the value has been successfully set in the cache.
 */
export async function setRedisCache(key: string, value: any, expirationInSeconds: number): Promise<void> {
  await redisClient.set(key, JSON.stringify(value), {
    expiration: { type: 'EX', value: expirationInSeconds },
  });
  return;
}

/**
 * Deletes a specific key from the Redis cache.
 *
 * @param key - The key to be removed from the Redis cache.
 * @returns A promise that resolves when the key has been successfully deleted.
 */
export async function deleteRedisCache(key: string): Promise<void> {
  await redisClient.del(key);
  return;
}
