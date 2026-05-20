export interface SymbolDiff {
  add: string[];
  remove: string[];
}

/**
 * Set-difference for two symbol lists. Order of inputs is irrelevant; the
 * returned `add`/`remove` arrays preserve the order they appear in `next`/`prev`
 * respectively, which keeps the SUBSCRIBE/UNSUBSCRIBE payloads stable.
 */
export const diffSymbols = (prev: string[], next: string[]): SymbolDiff => {
  const prevSet = new Set(prev);
  const nextSet = new Set(next);
  return {
    add: next.filter((s) => !prevSet.has(s)),
    remove: prev.filter((s) => !nextSet.has(s)),
  };
};
