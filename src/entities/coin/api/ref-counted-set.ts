/**
 * Multiset where membership is the union of independent subscribers. Items
 * appear once per distinct value (`keys()` is a set, not a bag); the count
 * tracks how many callers still want the item live, so removing one caller
 * doesn't tear down state another caller still depends on.
 */
export class RefCountedSet<T> {
  private readonly counts = new Map<T, number>();

  increment(items: Iterable<T>): void {
    for (const item of items) {
      this.counts.set(item, (this.counts.get(item) ?? 0) + 1);
    }
  }

  decrement(items: Iterable<T>): void {
    for (const item of items) {
      const next = (this.counts.get(item) ?? 0) - 1;
      if (next <= 0) this.counts.delete(item);
      else this.counts.set(item, next);
    }
  }

  get size(): number {
    return this.counts.size;
  }

  keys(): T[] {
    return Array.from(this.counts.keys());
  }
}
