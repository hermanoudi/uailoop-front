import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SKUFormData, SKUAttributes } from '../../types/sku';

interface SKUFormProps {
  productId: number;
  initialData?: Partial<SKUFormData>;
  onSubmit: (data: SKUFormData) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface AttributeField {
  key: string;
  value: string;
}

export const SKUForm: React.FC<SKUFormProps> = ({
  productId,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<SKUFormData, 'attributes'>>({
    defaultValues: {
      sku_code: initialData?.sku_code || '',
      price: initialData?.price || '',
      stock_quantity: initialData?.stock_quantity || '0',
      is_available: initialData?.is_available ?? true,
      weight: initialData?.weight || '',
      length: initialData?.length || '',
      width: initialData?.width || '',
      height: initialData?.height || '',
      image_url: initialData?.image_url || '',
    },
  });

  // Gerenciar atributos dinâmicos (cor, tamanho, etc)
  const [attributes, setAttributes] = useState<AttributeField[]>(
    initialData?.attributes
      ? Object.entries(initialData.attributes).map(([key, value]) => ({
          key,
          value: String(value),
        }))
      : [{ key: '', value: '' }]
  );

  const addAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (index: number, field: 'key' | 'value', value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const handleFormSubmit = (data: Omit<SKUFormData, 'attributes'>) => {
    // Converter atributos para objeto
    const attributesObject: SKUAttributes = attributes.reduce((acc, attr) => {
      if (attr.key && attr.value) {
        acc[attr.key] = attr.value;
      }
      return acc;
    }, {} as SKUAttributes);

    const formData: SKUFormData = {
      ...data,
      attributes: attributesObject,
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Código SKU */}
      <div>
        <label htmlFor="sku_code" className="block text-sm font-medium text-gray-700">
          Código SKU *
        </label>
        <input
          id="sku_code"
          type="text"
          {...register('sku_code', { required: 'Código SKU é obrigatório' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="Ex: PROD-001-RED-M"
        />
        {errors.sku_code && (
          <p className="mt-1 text-sm text-red-600">{errors.sku_code.message}</p>
        )}
      </div>

      {/* Atributos Dinâmicos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Atributos de Variação
        </label>
        <div className="space-y-2">
          {attributes.map((attr, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={attr.key}
                onChange={(e) => updateAttribute(index, 'key', e.target.value)}
                placeholder="Nome (ex: cor, tamanho)"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <input
                type="text"
                value={attr.value}
                onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                placeholder="Valor (ex: vermelho, M)"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => removeAttribute(index)}
                className="px-3 py-2 text-red-600 hover:text-red-800"
                disabled={attributes.length === 1}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addAttribute}
          className="mt-2 text-sm text-green-600 hover:text-green-800"
        >
          + Adicionar Atributo
        </button>
      </div>

      {/* Preço */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Preço (deixe vazio para usar o preço do produto)
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register('price')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="R$ 0,00"
        />
      </div>

      {/* Quantidade em Estoque */}
      <div>
        <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">
          Quantidade em Estoque *
        </label>
        <input
          id="stock_quantity"
          type="number"
          step="0.01"
          {...register('stock_quantity', { required: 'Quantidade é obrigatória' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
        {errors.stock_quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.stock_quantity.message}</p>
        )}
      </div>

      {/* Disponível */}
      <div className="flex items-center">
        <input
          id="is_available"
          type="checkbox"
          {...register('is_available')}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label htmlFor="is_available" className="ml-2 block text-sm text-gray-700">
          Disponível para venda
        </label>
      </div>

      {/* Dimensões e Peso */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            Peso (kg)
          </label>
          <input
            id="weight"
            type="number"
            step="0.001"
            {...register('weight')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="length" className="block text-sm font-medium text-gray-700">
            Comprimento (cm)
          </label>
          <input
            id="length"
            type="number"
            step="0.01"
            {...register('length')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="width" className="block text-sm font-medium text-gray-700">
            Largura (cm)
          </label>
          <input
            id="width"
            type="number"
            step="0.01"
            {...register('width')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700">
            Altura (cm)
          </label>
          <input
            id="height"
            type="number"
            step="0.01"
            {...register('height')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      {/* URL da Imagem */}
      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
          URL da Imagem
        </label>
        <input
          id="image_url"
          type="url"
          {...register('image_url')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar SKU'}
        </button>
      </div>
    </form>
  );
};
