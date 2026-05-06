const PALETTE = [
  "from-orange-500 to-yellow-400",
  "from-blue-500 to-indigo-400",
  "from-yellow-500 to-amber-400",
  "from-purple-500 to-violet-400",
  "from-sky-500 to-cyan-400",
  "from-blue-600 to-blue-400",
  "from-pink-500 to-rose-400",
  "from-emerald-500 to-teal-400",
  "from-red-500 to-orange-400",
  "from-indigo-500 to-purple-400",
  "from-fuchsia-500 to-pink-400",
  "from-green-500 to-emerald-400",
] as const;

const hash = (input: string): number => {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

export const getCoinGradient = (base: string): string =>
  PALETTE[hash(base) % PALETTE.length];
