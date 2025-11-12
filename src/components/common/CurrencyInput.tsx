import { forwardRef, useState, useRef, useEffect } from 'react';
import { formatForInput, parseCurrency } from '../../utils/currency';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number;
  onChange: (value: number) => void;
  error?: string;
}

/**
 * Currency input component with Brazilian Real (BRL) formatting
 * - Accepts comma as decimal separator
 * - Formats as user types
 * - Returns numeric value
 */
export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, error, className = '', ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState<string>('');
    const isUserTyping = useRef(false);

    // Only update display from prop when not actively typing
    useEffect(() => {
      if (!isUserTyping.current) {
        if (value !== undefined && value !== null && value !== 0) {
          setDisplayValue(formatForInput(value));
        } else if (value === 0 && displayValue === '') {
          // Keep empty if user cleared the field
          setDisplayValue('');
        }
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      isUserTyping.current = true;
      let inputValue = e.target.value;

      // Allow empty
      if (inputValue === '') {
        setDisplayValue('');
        onChange(0);
        return;
      }

      // Remove any non-numeric characters except comma and dot
      inputValue = inputValue.replace(/[^\d,.-]/g, '');

      // Replace dot with comma (accept both as decimal separator)
      inputValue = inputValue.replace(/\./g, ',');

      // Only allow one comma
      const commaCount = (inputValue.match(/,/g) || []).length;
      if (commaCount > 1) {
        // Remove extra commas
        const firstCommaIndex = inputValue.indexOf(',');
        inputValue = inputValue.substring(0, firstCommaIndex + 1) +
                     inputValue.substring(firstCommaIndex + 1).replace(/,/g, '');
      }

      // Limit decimal places to 2
      if (inputValue.includes(',')) {
        const [integer, decimal] = inputValue.split(',');
        if (decimal && decimal.length > 2) {
          inputValue = integer + ',' + decimal.slice(0, 2);
        } else {
          inputValue = integer + ',' + (decimal || '');
        }
      }

      // Update display
      setDisplayValue(inputValue);

      // Parse and send numeric value to parent
      const numericValue = parseCurrency(inputValue);
      onChange(numericValue);
    };

    const handleBlur = () => {
      isUserTyping.current = false;

      // Format on blur to ensure 2 decimal places
      if (displayValue && !displayValue.includes(',')) {
        const formatted = displayValue + ',00';
        setDisplayValue(formatted);
        onChange(parseCurrency(formatted));
      } else if (displayValue && displayValue.endsWith(',')) {
        const formatted = displayValue + '00';
        setDisplayValue(formatted);
        onChange(parseCurrency(formatted));
      } else if (displayValue && displayValue.split(',')[1]?.length === 1) {
        const formatted = displayValue + '0';
        setDisplayValue(formatted);
        onChange(parseCurrency(formatted));
      }
    };

    const handleFocus = () => {
      isUserTyping.current = true;
    };

    return (
      <div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            R$
          </span>
          <input
            ref={ref}
            type="text"
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
            placeholder="0,00"
            inputMode="decimal"
            {...props}
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
