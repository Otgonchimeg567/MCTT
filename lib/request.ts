/** Hash that opens the quote request dialog (see components/request/QuoteRequestDialog.tsx). */
export const REQUEST_HASH = "#request";

/** Link that opens the dialog, optionally with a product preselected (e.g. from a product card). */
export const requestHref = (productId?: string) =>
  productId ? `${REQUEST_HASH}?product=${encodeURIComponent(productId)}` : REQUEST_HASH;

export const isRequestHash = (hash: string) => hash === REQUEST_HASH || hash.startsWith(`${REQUEST_HASH}?`);
