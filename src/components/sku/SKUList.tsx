import React from 'react';
import type { SKUListItem } from '../../types/sku';

interface SKUListProps {
  skus: SKUListItem[];
  onEdit: (sku: SKUListItem) => void;
  onDelete: (skuId: number) => void;
  onToggleAvailability: (skuId: number, isAvailable: boolean) => void;
  isLoading?: boolean;
}

export const SKUList: React.FC<SKUListProps> = ({
  skus,
  onEdit,
  onDelete,
  onToggleAvailability,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (skus.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum SKU cadastrado para este produto.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código SKU
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Atributos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preço
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estoque
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Imagem
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {skus.map((sku) => (
            <tr key={sku.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {sku.sku_code}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {sku.attributes && Object.keys(sku.attributes).length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(sku.attributes).map(([key, value]) => (
                      <span
                        key={key}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {key}: {String(value)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {sku.price ? (
                  <span className="font-medium">
                    R$ {Number(sku.price).toFixed(2)}
                  </span>
                ) : (
                  <span className="text-gray-400">Preço do produto</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  className={
                    Number(sku.stock_quantity) > 0
                      ? 'text-green-600 font-medium'
                      : 'text-red-600 font-medium'
                  }
                >
                  {Number(sku.stock_quantity).toFixed(2)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onToggleAvailability(sku.id, !sku.is_available)}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    sku.is_available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {sku.is_available ? 'Disponível' : 'Indisponível'}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {sku.image_url ? (
                  <img
                    src={sku.image_url}
                    alt={sku.sku_code}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Sem imagem</span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(sku)}
                  className="text-green-600 hover:text-green-900 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Tem certeza que deseja excluir o SKU ${sku.sku_code}?`)) {
                      onDelete(sku.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
