import React from 'react';
import type { SKUListItem } from '../../types/sku';

interface SKUCardProps {
  sku: SKUListItem;
  productPrice?: number | string;
  onSelect?: (sku: SKUListItem) => void;
  selected?: boolean;
}

export const SKUCard: React.FC<SKUCardProps> = ({
  sku,
  productPrice,
  onSelect,
  selected = false,
}) => {
  const effectivePrice = sku.price || productPrice || 0;
  const inStock = Number(sku.stock_quantity) > 0;

  return (
    <div
      onClick={() => onSelect && onSelect(sku)}
      className={`
        relative border rounded-lg p-4 cursor-pointer transition-all
        ${selected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}
        ${!sku.is_available || !inStock ? 'opacity-50' : ''}
      `}
    >
      {/* Badge de Status */}
      {selected && (
        <div className="absolute top-2 right-2">
          <svg
            className="h-6 w-6 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Imagem */}
      {sku.image_url && (
        <div className="mb-3">
          <img
            src={sku.image_url}
            alt={sku.sku_code}
            className="w-full h-32 object-cover rounded"
          />
        </div>
      )}

      {/* Código SKU */}
      <div className="mb-2">
        <span className="text-xs text-gray-500 uppercase">Código:</span>
        <p className="text-sm font-semibold text-gray-900">{sku.sku_code}</p>
      </div>

      {/* Atributos */}
      {sku.attributes && Object.keys(sku.attributes).length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {Object.entries(sku.attributes).map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
              >
                <span className="capitalize">{key}:</span>{' '}
                <span className="ml-1 font-semibold">{String(value)}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Preço */}
      <div className="mb-2">
        <span className="text-lg font-bold text-green-600">
          R$ {Number(effectivePrice).toFixed(2)}
        </span>
      </div>

      {/* Estoque */}
      <div className="flex items-center justify-between text-xs">
        <span className={inStock ? 'text-green-600' : 'text-red-600'}>
          {inStock ? `${Number(sku.stock_quantity).toFixed(0)} em estoque` : 'Sem estoque'}
        </span>
        {!sku.is_available && (
          <span className="text-red-600 font-medium">Indisponível</span>
        )}
      </div>
    </div>
  );
};
