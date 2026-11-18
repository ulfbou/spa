export function createNamespacedStore({ namespace, schemaVersion }) {
  if (!namespace || !Number.isInteger(schemaVersion)) {
    throw new TypeError("A namespace and integer schemaVersion are required.");
  }

  const prefix = `${namespace}.v${schemaVersion}.`;

  return Object.freeze({
    get(key, fallback) {
      try {
        const value = localStorage.getItem(`${prefix}${key}`);
        return value === null ? fallback : JSON.parse(value);
      } catch {
        return fallback;
      }
    },

    set(key, value) {
      localStorage.setItem(`${prefix}${key}`, JSON.stringify(value));
    },

    remove(key) {
      localStorage.removeItem(`${prefix}${key}`);
    }
  });
}
