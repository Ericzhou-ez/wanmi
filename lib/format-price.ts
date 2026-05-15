const PRICE_LOCALE = "fr-FR";
const DEFAULT_CURRENCY_CODE = "EUR";

function getCurrencySymbol(currencyCode: string) {
  return currencyCode.toUpperCase() === "EUR" ? "€" : currencyCode;
}

function formatFallbackPrice(amount: string | number, currencyCode: string) {
  const normalizedAmount =
    typeof amount === "number" ? amount.toFixed(2) : amount.replace(".", ",");

  return `${normalizedAmount} ${getCurrencySymbol(currencyCode)}`;
}

export function formatPrice(
  amount: string | number,
  currencyCode = DEFAULT_CURRENCY_CODE,
) {
  const resolvedCurrencyCode = currencyCode || DEFAULT_CURRENCY_CODE;
  const value = typeof amount === "number" ? amount : Number(amount);

  if (!Number.isFinite(value)) {
    return formatFallbackPrice(amount, resolvedCurrencyCode);
  }

  try {
    return new Intl.NumberFormat(PRICE_LOCALE, {
      style: "currency",
      currency: resolvedCurrencyCode,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return formatFallbackPrice(value, resolvedCurrencyCode);
  }
}
