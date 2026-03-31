const cache: Record<string, any> = {};

export function getCache(key: string) {
  return cache[key];
}

export function setCache(key: string, value: any) {
  cache[key] = value;
}