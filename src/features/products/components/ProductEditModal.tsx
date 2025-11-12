import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../services/api';
import type { Product } from '../../../types/product';

interface ProductEditModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = [
  { value: 'acougues', label: 'Açougues' },
  { value: 'padarias', label: 'Padarias' },
  { value: 'hortifruti', label: 'Hortifruti' },
  { value: 'limpeza', label: 'Limpeza' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'pet', label: 'Pet Shop' },
  { value: 'diversos', label: 'Diversos' },
];

const UNITS = [
  { value: 'kg', label: 'Quilograma (kg)' },
  { value: 'g', label: 'Grama (g)' },
  { value: 'un', label: 'Unidade (un)' },
  { value: 'l', label: 'Litro (l)' },
  { value: 'ml', label: 'Mililitro (ml)' },
  { value: 'pc', label: 'Peça (pc)' },
  { value: 'cx', label: 'Caixa (cx)' },
  { value: 'pct', label: 'Pacote (pct)' },
];

export default function ProductEditModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: ProductEditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    unit: '',
    stock_quantity: '',
    is_available: true,
    image_url: '',
    sku: '',
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        unit: product.unit || '',
        stock_quantity: product.stock_quantity?.toString() || '',
        is_available: product.is_available ?? true,
        image_url: product.image_url || '',
        sku: product.sku || '',
        tags: product.tags || '',
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Converte vírgula para ponto antes de enviar
      const priceValue = parseFloat(formData.price.replace(',', '.'));
      const stockValue = formData.stock_quantity
        ? parseFloat(formData.stock_quantity.replace(',', '.'))
        : null;

      await api.patch(`/products/${product.id}`, {
        name: formData.name,
        description: formData.description || null,
        price: priceValue,
        category: formData.category,
        unit: formData.unit,
        stock_quantity: stockValue,
        is_available: formData.is_available,
        image_url: formData.image_url || null,
        sku: formData.sku || null,
        tags: formData.tags || null,
      });

      toast.success('Produto atualizado com sucesso!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      toast.error(
        error.response?.data?.detail || 'Erro ao atualizar produto. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Editar Produto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Produto *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-uai focus:border-transparent"
              required
            />
          </div>

          {/* SKU */}
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
              Código SKU {product.sku && '(somente editável se vazio)'}
            </label>
            <input
              type="text"
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              disabled={!!product.sku}
              placeholder="Digite o código SKU"
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-uai focus:border-transparent ${
                product.sku ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
            {product.sku && (
              <p className="text-xs text-gray-500 mt-1">
                O SKU não pode ser alterado após ser definido
              </p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-uai focus:border-transparent"
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Ex: orgânico, promocional, importado (separado por vírgula)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-uai focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separe as tags com vírgula para facilitar a busca
            </p>
          </div>

          {/* URL da Imagem */}
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
              URL da Imagem
            </label>
            <input
              type="url"
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-uai focus:border-transparent"
            />
            {formData.image_url && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.alt = 'Erro ao carregar imagem';
                  }}
                />
              </div>
            )}
          </div>

          {/* Preço e Unidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Preço (R$) *
              </label>
              <input
                type="text"
                id="price"
                value={formData.price}
                onChange={(e) => {
                  // Aceita vírgula e ponto como separador decimal
                  let value = e.target.value;
                  // Remove tudo exceto números, vírgula e ponto
                  value = value.replace(/[^\d,\.]/g, '');
                  // Substitui vírgula por ponto para processamento interno
                  setFormData({ ...formData, price: value });
                }}
                placeholder="0,00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-uai focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unidade de Medida *
              </label>
              <select
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-uai focus:border-transparent"
                required
              >
                <option value="">Selecione...</option>
                {UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Categoria e Estoque */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-uai focus:border-transparent"
                required
              >
                <option value="">Selecione...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade em Estoque
              </label>
              <input
                type="text"
                id="stock_quantity"
                value={formData.stock_quantity}
                onChange={(e) => {
                  // Aceita vírgula e ponto como separador decimal
                  let value = e.target.value;
                  // Remove tudo exceto números, vírgula e ponto
                  value = value.replace(/[^\d,\.]/g, '');
                  setFormData({ ...formData, stock_quantity: value });
                }}
                placeholder="0,00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-uai focus:border-transparent"
              />
            </div>
          </div>

          {/* Disponibilidade */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_available"
              checked={formData.is_available}
              onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              className="w-4 h-4 text-green-uai border-gray-300 rounded focus:ring-green-uai"
            />
            <label htmlFor="is_available" className="ml-2 text-sm text-gray-700">
              Produto disponível para venda
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
