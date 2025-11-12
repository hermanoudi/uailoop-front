import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface LocationContextType {
  cep: string | null;
  setCep: (cep: string) => void;
  clearCep: () => void;
  isLocationSet: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [cep, setCepState] = useState<string | null>(null);

  // Load CEP from localStorage on mount
  useEffect(() => {
    const savedCep = localStorage.getItem('user_cep');
    if (savedCep) {
      setCepState(savedCep);
    }
  }, []);

  const setCep = (newCep: string) => {
    // Clean CEP (remove non-numeric characters)
    const cleanCep = newCep.replace(/\D/g, '');

    if (cleanCep.length === 8) {
      // Format CEP: 12345-678
      const formattedCep = `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
      setCepState(formattedCep);
      localStorage.setItem('user_cep', formattedCep);
    }
  };

  const clearCep = () => {
    setCepState(null);
    localStorage.removeItem('user_cep');
  };

  const isLocationSet = cep !== null && cep.length > 0;

  return (
    <LocationContext.Provider value={{ cep, setCep, clearCep, isLocationSet }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
