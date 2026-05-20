type TranslateFn = (key: string) => string;

let translator: TranslateFn | null = null;

export const setGlobalTranslator = (fn: TranslateFn): void => {
  translator = fn;
};

// Translator for non-React contexts (e.g. apiFetch). Populated by GlobalTranslatorBridge
// once the client tree mounts. Returns `fallback` if the bridge hasn't run yet or the
// key is missing — keeps callers safe against pre-mount calls.
export const translateGlobal = (key: string, fallback: string): string => {
  if (!translator) return fallback;
  try {
    return translator(key);
  } catch {
    return fallback;
  }
};
