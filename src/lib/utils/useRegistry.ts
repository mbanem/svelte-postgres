export type Registry<T> = {
  register: (id: string, instance: T | null) => void;
  get: (id: string) => T | undefined;
  values: () => IterableIterator<T>;
};

export function createRegistry<T>(): Registry<T> {
  const map = new Map<string, T>();

  return {
    register(id, instance) {
      if (instance) map.set(id, instance);
      else map.delete(id);
    },
    get(id) {
      return map.get(id);
    },
    values() {
      return map.values();
    }
  };
}
