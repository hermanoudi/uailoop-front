import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Search } from 'lucide-react';
import { subscriptionPlanService } from '../../services/subscriptionService';
import type { SubscriptionPlanCreate, SubscriptionFrequency } from '../../types';
import { SubscriptionFrequencyLabels } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { formatBRL, parseBRL, sanitizeCurrencyInput } from '../../utils/format';

interface ProductItem {
  product_id: number;
  quantity: number;
  sku_code: string;
  product_name?: string;
  loading?: boolean;
}

interface ProductInfo {
  id: number;
  name: string;
  sku: string | null;
  price: number;
  is_available: boolean;
}

export default function SellerSubscriptionPlanFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { planId } = useParams<{ planId: string }>();
  const isEditing = !!planId;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SubscriptionPlanCreate>({
    name: '',
    description: '',
    available_frequencies: ['weekly'] as SubscriptionFrequency[],
    price: 0,
    delivery_fee: 0,
    discount_percentage: 0,
    products: [],
    is_active: true,
  });

  const [products, setProducts] = useState<ProductItem[]>([
    { product_id: 0, quantity: 1, sku_code: '' }
  ]);

  // Separate state for currency input display
  const [priceInput, setPriceInput] = useState<string>('0,00');
  const [deliveryFeeInput, setDeliveryFeeInput] = useState<string>('0,00');

  useEffect(() => {
    if (isEditing && planId) {
      loadPlan(parseInt(planId));
    }
  }, [planId]);

  const loadPlan = async (id: number) => {
    try {
      setLoading(true);
      const plan = await subscriptionPlanService.get(id);
      setFormData({
        name: plan.name,
        description: plan.description || '',
        available_frequencies: plan.available_frequencies,
        price: plan.price,
        delivery_fee: plan.delivery_fee || 0,
        discount_percentage: plan.discount_percentage || 0,
        products: plan.products,
        is_active: plan.is_active,
      });
      // Initialize input fields with formatted values
      setPriceInput(formatBRL(plan.price));
      setDeliveryFeeInput(formatBRL(plan.delivery_fee || 0));
      // Note: When editing, we don't have SKU codes, only product IDs
      setProducts(plan.products.map(p => ({
        product_id: p.product_id,
        quantity: p.quantity,
        sku_code: '',
        product_name: 'Carregue as informações do produto'
      })));
    } catch (error: any) {
      toast.error('Erro ao carregar plano');
      console.error(error);
      navigate('/seller/subscription-plans');
    } finally {
      setLoading(false);
    }
  };

  const searchSKU = async (index: number, skuCode: string) => {
    if (!skuCode.trim()) {
      return;
    }

    // Update loading state
    const newProducts = [...products];
    newProducts[index].loading = true;
    setProducts(newProducts);

    try {
      const response = await api.get<ProductInfo>(`/products/search-by-sku/${skuCode}`);
      const productInfo = response.data;

      // Update product with info
      const updatedProducts = [...products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        product_id: productInfo.id,
        product_name: productInfo.name,
        loading: false,
      };
      setProducts(updatedProducts);

      toast.success(`Produto encontrado: ${productInfo.name}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Produto com este código SKU não encontrado';
      toast.error(errorMessage);

      const updatedProducts = [...products];
      updatedProducts[index].product_id = 0;
      updatedProducts[index].product_name = undefined;
      updatedProducts[index].loading = false;
      setProducts(updatedProducts);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error('Nome do plano é obrigatório');
      return;
    }

    if (formData.available_frequencies.length === 0) {
      toast.error('Selecione pelo menos uma frequência de entrega');
      return;
    }

    if (formData.price <= 0) {
      toast.error('Preço deve ser maior que zero');
      return;
    }

    if (products.length === 0) {
      toast.error('Adicione pelo menos um produto ao plano');
      return;
    }

    // Check if all products have valid IDs
    if (products.some(p => p.product_id <= 0)) {
      toast.error('Todos os produtos devem ser pesquisados por código SKU');
      return;
    }

    try {
      setLoading(true);

      const planData: SubscriptionPlanCreate = {
        ...formData,
        products: products.map(p => ({
          product_id: p.product_id,
          quantity: p.quantity,
        })),
      };

      if (isEditing && planId) {
        await subscriptionPlanService.update(parseInt(planId), planData);
        toast.success('Plano atualizado com sucesso!');
      } else {
        await subscriptionPlanService.create(planData);
        toast.success('Plano criado com sucesso!');
      }

      navigate('/seller/subscription-plans');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erro ao salvar plano';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = () => {
    setProducts([...products, { product_id: 0, quantity: 1, sku_code: '' }]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof ProductItem, value: any) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  // Handle currency input change - allow free typing
  const handleCurrencyChange = (value: string, field: 'price' | 'delivery_fee') => {
    const sanitized = sanitizeCurrencyInput(value);

    if (field === 'price') {
      setPriceInput(sanitized);
    } else {
      setDeliveryFeeInput(sanitized);
    }
  };

  // Handle currency input blur - parse and update formData
  const handleCurrencyBlur = (field: 'price' | 'delivery_fee') => {
    const inputValue = field === 'price' ? priceInput : deliveryFeeInput;
    const numericValue = parseBRL(inputValue);

    // Update formData with parsed value
    setFormData({ ...formData, [field]: numericValue });

    // Format the input for display
    const formatted = formatBRL(numericValue);
    if (field === 'price') {
      setPriceInput(formatted);
    } else {
      setDeliveryFeeInput(formatted);
    }
  };

  // Handle frequency checkbox toggle
  const toggleFrequency = (frequency: SubscriptionFrequency) => {
    const current = formData.available_frequencies;
    const isSelected = current.includes(frequency);

    if (isSelected) {
      // Remove frequency
      setFormData({
        ...formData,
        available_frequencies: current.filter(f => f !== frequency)
      });
    } else {
      // Add frequency
      setFormData({
        ...formData,
        available_frequencies: [...current, frequency]
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom px-4 py-6">
          <button
            onClick={() => navigate('/seller/subscription-plans')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Planos
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Editar Plano de Assinatura' : 'Criar Plano de Assinatura'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="container-custom px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Básicas</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Plano *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Cesta Básica Semanal"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Descreva os benefícios deste plano..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Frequências de Entrega Disponíveis *
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Selecione as opções de frequência que o cliente poderá escolher ao assinar este plano
                  </p>
                  <div className="space-y-2">
                    {(['daily', 'weekly', 'biweekly', 'monthly'] as SubscriptionFrequency[]).map((freq) => (
                      <label key={freq} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.available_frequencies.includes(freq)}
                          onChange={() => toggleFrequency(freq)}
                          className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {SubscriptionFrequencyLabels[freq]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Preços e Taxas</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={priceInput}
                    onChange={(e) => handleCurrencyChange(e.target.value, 'price')}
                    onBlur={() => handleCurrencyBlur('price')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0,00"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Use vírgula para decimais (ex: 49,90)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taxa de Entrega (R$)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={deliveryFeeInput}
                    onChange={(e) => handleCurrencyChange(e.target.value, 'delivery_fee')}
                    onBlur={() => handleCurrencyBlur('delivery_fee')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0,00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use vírgula para decimais (ex: 5,00)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desconto (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Valor inteiro (ex: 10 para 10%)</p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Produtos *</h2>
                <button
                  type="button"
                  onClick={addProduct}
                  className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Produto
                </button>
              </div>

              <div className="space-y-4">
                {products.map((product, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Código SKU do Produto *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={product.sku_code}
                            onChange={(e) => updateProduct(index, 'sku_code', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                searchSKU(index, product.sku_code);
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Ex: E35012"
                            disabled={product.loading}
                          />
                          <button
                            type="button"
                            onClick={() => searchSKU(index, product.sku_code)}
                            disabled={product.loading || !product.sku_code.trim()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {product.loading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <Search className="w-4 h-4" />
                            )}
                            Buscar
                          </button>
                        </div>
                      </div>

                      <div className="w-32">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Quantidade
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>

                      {products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Product Name Display */}
                    {product.product_name && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-green-800">
                          ✓ Produto: {product.product_name}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          ID: {product.product_id}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 mt-3">
                <strong>Dica:</strong> Digite o código SKU do produto e clique em "Buscar" ou pressione Enter.
                O sistema buscará automaticamente o produto correspondente na sua loja.
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Plano ativo (visível para clientes)
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/seller/subscription-plans')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-black px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isEditing ? 'Atualizar Plano' : 'Criar Plano'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
