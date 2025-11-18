/**
 * Utility functions for formatting values in Brazilian Portuguese format
 */

/**
 * Format number as Brazilian currency (R$)
 * @param value - Numeric value to format
 * @returns Formatted string (e.g., "1.234,56")
 */
export const formatBRL = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Format number as Brazilian currency with R$ symbol
 * @param value - Numeric value to format
 * @returns Formatted string (e.g., "R$ 1.234,56")
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

/**
 * Parse Brazilian currency format to number
 * @param value - String value to parse (e.g., "1.234,56" or "1234,56")
 * @returns Numeric value
 */
export const parseBRL = (value: string): number => {
  // Remove currency symbol and spaces
  let cleanValue = value.replace(/[R$\s]/g, '');

  // Remove thousand separators (dots) and replace comma with dot
  cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');

  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format date in Brazilian format (dd/mm/yyyy)
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "25/12/2024")
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR');
};

/**
 * Format date and time in Brazilian format (dd/mm/yyyy HH:mm)
 * @param date - Date string or Date object
 * @returns Formatted date/time string (e.g., "25/12/2024 14:30")
 */
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date and time with full details in Brazilian format
 * @param date - Date string or Date object
 * @returns Formatted date/time string (e.g., "25/12/2024 às 14:30:45")
 */
export const formatDateTimeFull = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Validate Brazilian currency input
 * Allows only numbers, comma and optionally dot for thousands
 * @param value - Input string to validate
 * @returns Cleaned string with valid characters only
 */
export const sanitizeCurrencyInput = (value: string): string => {
  // Allow only digits, comma and dot
  return value.replace(/[^\d,.]/g, '');
};
