import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { useLocation } from '../../contexts/LocationContext';

interface CEPSelectorProps {
  onCepChange?: (cep: string) => void;
}

export const CEPSelector: React.FC<CEPSelectorProps> = ({ onCepChange }) => {
  const { cep, setCep, clearCep } = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate CEP
    const cleanCep = inputValue.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      setError('CEP deve ter 8 dígitos');
      return;
    }

    // Format and save
    const formattedCep = `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
    setCep(formattedCep);
    setIsEditing(false);
    setInputValue('');

    // Callback
    if (onCepChange) {
      onCepChange(formattedCep);
    }
  };

  const handleClear = () => {
    clearCep();
    setIsEditing(true);
    setInputValue('');
    setError('');

    if (onCepChange) {
      onCepChange('');
    }
  };

  const formatCepInput = (value: string) => {
    // Remove non-numeric
    const numbers = value.replace(/\D/g, '');

    // Limit to 8 digits
    const limited = numbers.slice(0, 8);

    // Format: 12345-678
    if (limited.length > 5) {
      return `${limited.slice(0, 5)}-${limited.slice(5)}`;
    }

    return limited;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCepInput(e.target.value);
    setInputValue(formatted);
    setError('');
  };

  if (!isEditing && cep) {
    // Show selected CEP
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
        <MapPin className="w-5 h-5 text-primary" />
        <div className="flex-1">
          <p className="text-xs text-gray-500">Entrego aqui?</p>
          <p className="text-sm font-medium text-gray-900">{cep}</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs text-primary hover:text-primary-dark font-medium"
        >
          Alterar
        </button>
        <button
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600"
          title="Limpar CEP"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Show input form
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Digite seu CEP"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                error
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-primary'
              }`}
              autoFocus
            />
          </div>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
        >
          OK
        </button>
        {cep && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setInputValue('');
              setError('');
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Informe seu CEP para ver produtos disponíveis na sua região
      </p>
    </form>
  );
};
