/**
 * Formatadores para padrões brasileiros
 * CPF, CNPJ, CEP, Telefone, Moeda, Data
 */

export const formatters = {
  /**
   * Formata CPF: 12345678901 → 123.456.789-01
   */
  cpf: (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  },

  /**
   * Formata CNPJ: 12345678000190 → 12.345.678/0001-90
   * Suporta alfanumérico (2026+)
   */
  cnpj: (value: string): string => {
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    return cleaned
      .replace(/^(\w{2})(\w)/, '$1.$2')
      .replace(/^(\w{2})\.(\w{3})(\w)/, '$1.$2.$3')
      .replace(/\.(\w{3})(\w)/, '.$1/$2')
      .replace(/(\w{4})(\w)/, '$1-$2');
  },

  /**
   * Formata documento (detecta CPF ou CNPJ automaticamente)
   */
  document: (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      return formatters.cpf(cleaned);
    }
    return formatters.cnpj(cleaned);
  },

  /**
   * Formata CEP: 30110000 → 30110-000
   */
  cep: (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.replace(/^(\d{5})(\d)/, '$1-$2');
  },

  /**
   * Formata telefone: 31987654321 → (31) 98765-4321
   */
  phone: (value: string): string => {
    const digits = value.replace(/\D/g, '');

    if (digits.length === 11) {
      return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }

    if (digits.length === 10) {
      return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }

    return value;
  },

  /**
   * Formata moeda: 4590 (centavos) → R$ 45,90
   */
  currency: (cents: number): string => {
    const reais = cents / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(reais);
  },

  /**
   * Formata moeda de um valor em reais: 45.90 → R$ 45,90
   */
  currencyFromReais: (reais: number | string): string => {
    const value = typeof reais === 'string' ? parseFloat(reais) : reais;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  },

  /**
   * Formata data: 2025-10-24 → 24/10/2025
   */
  date: (date: string | Date): string => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  },

  /**
   * Formata data/hora com timezone brasileiro
   */
  datetime: (date: string | Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'America/Sao_Paulo',
    }).format(new Date(date));
  },

  /**
   * Formata data por extenso: 2025-10-24 → 24 de outubro de 2025
   */
  dateLong: (date: string | Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  },

  /**
   * Formata número: 1000 → 1.000
   */
  number: (value: number): string => {
    return new Intl.NumberFormat('pt-BR').format(value);
  },

  /**
   * Formata percentual: 0.15 → 15%
   */
  percent: (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  },
};

/**
 * Validadores para padrões brasileiros
 */
export const validators = {
  /**
   * Valida CPF
   */
  cpf: (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleaned)) return false; // Todos os dígitos iguais

    let sum = 0;
    let remainder: number;

    // Validação do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

    sum = 0;

    // Validação do segundo dígito verificador
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

    return true;
  },

  /**
   * Valida CNPJ (numérico ou alfanumérico)
   */
  cnpj: (cnpj: string): boolean => {
    const cleaned = cnpj.replace(/[^A-Z0-9]/gi, '');

    if (cleaned.length !== 14) return false;

    // Se for alfanumérico (a partir de 2026), apenas verifica o comprimento
    if (/[A-Z]/i.test(cleaned)) {
      return cleaned.length === 14;
    }

    // Validação numérica tradicional
    if (/^(\d)\1+$/.test(cleaned)) return false;

    let length = cleaned.length - 2;
    let numbers = cleaned.substring(0, length);
    const digits = cleaned.substring(length);
    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    length = length + 1;
    numbers = cleaned.substring(0, length);
    sum = 0;
    pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
  },

  /**
   * Valida CEP
   */
  cep: (cep: string): boolean => {
    const cleaned = cep.replace(/\D/g, '');
    return cleaned.length === 8;
  },

  /**
   * Valida telefone brasileiro
   */
  phone: (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
  },

  /**
   * Valida email
   */
  email: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },
};

/**
 * Máscaras para inputs
 */
export const masks = {
  /**
   * Remove todos os não-dígitos
   */
  onlyNumbers: (value: string): string => {
    return value.replace(/\D/g, '');
  },

  /**
   * Remove tudo exceto letras e números
   */
  alphanumeric: (value: string): string => {
    return value.replace(/[^A-Z0-9]/gi, '');
  },

  /**
   * Aplica máscara de CPF enquanto digita
   */
  cpfMask: (value: string): string => {
    return formatters.cpf(value);
  },

  /**
   * Aplica máscara de CNPJ enquanto digita
   */
  cnpjMask: (value: string): string => {
    return formatters.cnpj(value);
  },

  /**
   * Aplica máscara de CEP enquanto digita
   */
  cepMask: (value: string): string => {
    return formatters.cep(value);
  },

  /**
   * Aplica máscara de telefone enquanto digita
   */
  phoneMask: (value: string): string => {
    return formatters.phone(value);
  },
};

/**
 * Helper functions exported for convenience
 */
export const formatCurrency = formatters.currencyFromReais;
export const formatDate = formatters.date;
export const formatDateTime = formatters.datetime;
export const formatPhone = formatters.phone;
export const formatCPF = formatters.cpf;
export const formatCNPJ = formatters.cnpj;
