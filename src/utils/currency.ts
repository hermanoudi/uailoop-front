/**
 * Currency utilities for Brazilian Real (BRL)
 */

/**
 * Format number to Brazilian currency (R$ 1.234,56)
 */
export function formatCurrency(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return 'R$ 0,00';
  }

  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Parse Brazilian currency string to number
 * Converts "R$ 1.234,56" or "1.234,56" or "1234,56" to 1234.56
 */
export function parseCurrency(value: string): number {
  if (!value) return 0;

  // Remove currency symbol and spaces
  let cleaned = value.replace(/R\$\s?/g, '');

  // Remove thousand separators (dots)
  cleaned = cleaned.replace(/\./g, '');

  // Replace decimal separator (comma) with dot
  cleaned = cleaned.replace(',', '.');

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format input value for currency field (as user types)
 * Accepts: "1234.56" or "1234,56" and returns formatted "1.234,56"
 */
export function formatCurrencyInput(value: string): string {
  if (!value) return '';

  // Remove all non-numeric characters except comma and dot
  let cleaned = value.replace(/[^\d,.-]/g, '');

  // Handle decimal separator (accept both comma and dot)
  // Convert dot to comma for BR format
  if (cleaned.includes('.')) {
    const parts = cleaned.split('.');
    if (parts.length === 2) {
      cleaned = parts[0] + ',' + parts[1];
    }
  }

  // Limit decimal places to 2
  if (cleaned.includes(',')) {
    const [integer, decimal] = cleaned.split(',');
    cleaned = integer + ',' + decimal.slice(0, 2);
  }

  return cleaned;
}

/**
 * Format number with thousand separators and comma for decimals
 * Example: 1234.56 -> "1.234,56"
 */
export function formatNumber(value: number | string, decimals: number = 2): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '0';
  }

  return numValue.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Validate if string is a valid currency value
 */
export function isValidCurrency(value: string): boolean {
  if (!value) return false;

  // Remove currency symbol and spaces
  const cleaned = value.replace(/R\$\s?/g, '').trim();

  // Check if it matches Brazilian currency format
  // Accepts: 1234,56 or 1.234,56 or 1.234.567,89
  const regex = /^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+(,\d{1,2})?$/;

  return regex.test(cleaned);
}

/**
 * Component helper: handles onChange for currency inputs
 * Returns the numeric value for form state
 */
export function handleCurrencyChange(
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (value: number) => void
) {
  const inputValue = e.target.value;
  const formatted = formatCurrencyInput(inputValue);

  // Update the input display
  e.target.value = formatted;

  // Update the form state with numeric value
  const numericValue = parseCurrency(formatted);
  onChange(numericValue);
}

/**
 * Format value for display in input (shows comma)
 */
export function formatForInput(value: number | string): string {
  if (!value) return '';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '';
  }

  return numValue.toFixed(2).replace('.', ',');
}
