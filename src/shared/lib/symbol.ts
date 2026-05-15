export const stripQuote = (symbol: string, quote: string): string =>
  symbol.endsWith(quote) ? symbol.slice(0, -quote.length) : symbol;

export const swapQuote = (symbol: string, oldQuote: string, newQuote: string): string =>
  `${stripQuote(symbol, oldQuote)}${newQuote}`;
