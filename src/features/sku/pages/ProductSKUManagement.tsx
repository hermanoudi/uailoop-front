import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SKUForm, SKUList } from '../../../components/sku';
import {
  getProductSKUs,
  createSKU,
  updateSKU,
  deleteSKU,
  updateSKUAvailability,
} from '../../../services/sku.service';
import type { SKUListItem, SKUFormData, SKUCreateInput, SKUUpdateInput } from '../../../types/sku';

export const ProductSKUManagement: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [skus, setSkus] = useState<SKUListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSKU, setEditingSKU] = useState<SKUListItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSKUs = async () => {
    if (!productId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getProductSKUs(parseInt(productId));
      setSkus(data);
    } catch (err) {
      console.error('Erro ao carregar SKUs:', err);
      setError('Erro ao carregar SKUs. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSKUs();
  }, [productId]);

  const handleCreateSKU = async (formData: SKUFormData) => {
    if (!productId) return;

    try {
      setIsLoading(true);
      setError(null);

      const createData: SKUCreateInput = {
        product_id: parseInt(productId),
        sku_code: formData.sku_code,
        attributes: formData.attributes,
        price: formData.price ? parseFloat(formData.price) : null,
        stock_quantity: parseFloat(formData.stock_quantity),
        is_available: formData.is_available,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        length: formData.length ? parseFloat(formData.length) : null,
        width: formData.width ? parseFloat(formData.width) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        image_url: formData.image_url || null,
      };

      await createSKU(createData);
      await loadSKUs();
      setIsFormOpen(false);
      alert('SKU criado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao criar SKU:', err);
      const errorMessage = err.response?.data?.detail || 'Erro ao criar SKU. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSKU = async (formData: SKUFormData) => {
    if (!editingSKU) return;

    try {
      setIsLoading(true);
      setError(null);

      const updateData: SKUUpdateInput = {
        sku_code: formData.sku_code,
        attributes: formData.attributes,
        price: formData.price ? parseFloat(formData.price) : null,
        stock_quantity: parseFloat(formData.stock_quantity),
        is_available: formData.is_available,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        length: formData.length ? parseFloat(formData.length) : null,
        width: formData.width ? parseFloat(formData.width) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        image_url: formData.image_url || null,
      };

      await updateSKU(editingSKU.id, updateData);
      await loadSKUs();
      setIsFormOpen(false);
      setEditingSKU(null);
      alert('SKU atualizado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao atualizar SKU:', err);
      const errorMessage = err.response?.data?.detail || 'Erro ao atualizar SKU. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSKU = async (skuId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await deleteSKU(skuId);
      await loadSKUs();
      alert('SKU excluído com sucesso!');
    } catch (err: any) {
      console.error('Erro ao excluir SKU:', err);
      const errorMessage = err.response?.data?.detail || 'Erro ao excluir SKU. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAvailability = async (skuId: number, isAvailable: boolean) => {
    try {
      setIsLoading(true);
      setError(null);
      await updateSKUAvailability(skuId, isAvailable);
      await loadSKUs();
    } catch (err: any) {
      console.error('Erro ao atualizar disponibilidade:', err);
      const errorMessage = err.response?.data?.detail || 'Erro ao atualizar disponibilidade.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (sku: SKUListItem) => {
    setEditingSKU(sku);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingSKU(null);
    setError(null);
  };

  const handleNewSKU = () => {
    setEditingSKU(null);
    setIsFormOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-green-600 hover:text-green-800 flex items-center mb-4"
        >
          ← Voltar
        </button>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar SKUs</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gerencie as variações e estoque do produto
            </p>
          </div>
          {!isFormOpen && (
            <button
              onClick={handleNewSKU}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              disabled={isLoading}
            >
              + Novo SKU
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isFormOpen && (
        <div className="mb-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingSKU ? 'Editar SKU' : 'Novo SKU'}
          </h2>
          <SKUForm
            productId={parseInt(productId!)}
            initialData={
              editingSKU
                ? {
                    sku_code: editingSKU.sku_code,
                    attributes: editingSKU.attributes || {},
                    price: editingSKU.price?.toString() || '',
                    stock_quantity: editingSKU.stock_quantity.toString(),
                    is_available: editingSKU.is_available,
                    weight: '',
                    length: '',
                    width: '',
                    height: '',
                    image_url: editingSKU.image_url || '',
                  }
                : undefined
            }
            onSubmit={editingSKU ? handleUpdateSKU : handleCreateSKU}
            onCancel={handleCancelForm}
            isLoading={isLoading}
          />
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <SKUList
          skus={skus}
          onEdit={handleEdit}
          onDelete={handleDeleteSKU}
          onToggleAvailability={handleToggleAvailability}
          isLoading={isLoading && !isFormOpen}
        />
      </div>
    </div>
  );
};
