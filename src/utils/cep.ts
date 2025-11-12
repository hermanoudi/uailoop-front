/**
 * CEP utilities - Address lookup from Brazilian postal codes
 */

export interface ViaCEPResponse {
  cep: string;
  logradouro: string; // Street
  complemento: string;
  bairro: string; // Neighborhood
  localidade: string; // City
  uf: string; // State
  erro?: boolean;
}

/**
 * Fetch address from CEP using ViaCEP API
 * @param cep - CEP with or without formatting (12345-678 or 12345678)
 * @returns Address data or null if not found
 */
export async function fetchAddressFromCEP(cep: string): Promise<ViaCEPResponse | null> {
  try {
    // Remove formatting
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

    if (!response.ok) {
      throw new Error('Erro ao buscar CEP');
    }

    const data: ViaCEPResponse = await response.json();

    if (data.erro) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching CEP:', error);
    return null;
  }
}

/**
 * Format CEP: 12345678 -> 12345-678
 */
export function formatCEP(cep: string): string {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length === 8) {
    return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
  }
  return cep;
}

/**
 * Format CNPJ: 12345678901234 -> 12.345.678/9012-34
 */
export function formatCNPJ(cnpj: string): string {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  if (cleanCNPJ.length === 14) {
    return cleanCNPJ.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }
  return cnpj;
}

/**
 * Format phone: 31999887766 -> (31) 99988-7766
 */
export function formatPhone(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (cleanPhone.length === 10) {
    return cleanPhone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  return phone;
}
